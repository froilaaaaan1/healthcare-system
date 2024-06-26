'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const updateAndResetPasswordSchema = z
	.object({
		newPassword: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

const signUpSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
		terms: z.boolean(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
	.refine((data) => data.terms, {
		message: 'You must agree to the terms and conditions',
		path: ['terms'],
	})
	.refine((data) => data.email && data.password, {
		message: 'Email and password are required',
		path: ['email', 'password'],
	});

const forgotPasswordSchema = z
	.object({
		email: z.string().email(),
	})
	.refine((data) => data.email, {
		message: 'Email is required',
		path: ['email'],
	});

const loginSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
	})
	.refine((data) => data.email && data.password, {
		message: 'Email and password are required',
		path: ['email', 'password'],
	});

const deleteSchema = z
	.object({
		user_id: z.string(),
	})
	.refine((data) => data.user_id, {
		message: 'User ID is required',
		path: ['user_id'],
	});

export async function getUserRole() {
	const supabase = createClient();
	let redirectPath = '';

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		try {
			const { data: role, error } = await supabase
				.from('users')
				.select('role')
				.eq('user_id', user?.id)
				.single();
			if (error) throw new Error(error.message);

			switch (role?.role) {
				case 'admin':
					redirectPath = '/admin/dashboard';
					break;
				case 'doctor':
					redirectPath = '/doctor/dashboard';
					break;
				case 'user':
					redirectPath = '/user/dashboard';
					break;
				default:
					redirectPath = '/account/role';
					break;
			}
		} catch (error) {
			console.error('Error fetching user role: ', error);
			redirectPath = '/account/role';
		}
	} catch (error) {
		console.error('Error fetching user: ', error);
		redirectPath = '/account/login';
	}

	redirect(redirectPath);
}
export async function login(formData: { email: string; password: string }) {
	const supabase = createClient();
	let redirectPath = '';

	try {
		const data = loginSchema.safeParse(formData);

		if (!data.success) throw new Error('Invalid email or password');

		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: data.data.email,
			password: data.data.password,
		});

		if (signInError) {
			throw new Error(signInError.message);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data: role, error: roleError } = await supabase
			.from('users')
			.select('role')
			.eq('user_id', user?.id)
			.single();

		if (roleError) throw new Error(roleError.message);

		switch (role?.role) {
			case 'admin':
				redirectPath = '/admin/dashboard';
				break;
			case 'doctor':
				redirectPath = '/doctor/dashboard';
				break;
			case 'user':
				redirectPath = '/user/dashboard';
				break;
			default:
				redirectPath = '/account/role';
				break;
		}
	} catch (error) {
		console.error('Error: ', error);
		redirectPath = '/account/login';
	}

	revalidatePath('/', 'layout');
	redirect(redirectPath);
	return null;
}
export async function signup(formData: FormData) {
	const supabase = createClient();
	const data = signUpSchema.parse({
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		confirmPassword: formData.get('confirmPassword') as string,
		terms: formData.get('terms') === 'on',
	});
	const result = signUpSchema.safeParse(data);

	if (!result.success) throw new Error(result.error.errors[0].message);
	if (!result.data.terms)
		throw new Error('You must agree to the terms and conditions');
	if (result.data.password !== result.data.confirmPassword)
		throw new Error('Passwords do not match');

	const { error } = await supabase.auth.signUp({
		email: result.data.email,
		password: result.data.password,
	});

	if (error) {
		console.error(error.message);
		redirect('/account/error');
		return;
	}

	revalidatePath('/', 'layout');
	redirect('/account/login');
}

export async function insertUserDataToPublic(formData: FormData) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
}

export async function logoutSession() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
	redirect('/');
}

export async function forgotPassword(formData: FormData) {
	const supabase = createClient();
	const result = forgotPasswordSchema.parse({
		email: formData.get('email') as string,
	});
	if (!result.email) {
		throw new Error('Email is required');
	}
	const { email } = result;

	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: 'http://localhost:3000/account/reset-password',
	});
	if (error) throw new Error(error.message);
}

export async function resetAndUpdatePassword(formData: FormData) {
	const supabase = createClient();
	const data = updateAndResetPasswordSchema.parse({
		newPassword: formData.get('newPassword') as string,
		confirmPassword: formData.get('confirmPassword') as string,
	});

	if (data.newPassword !== data.confirmPassword)
		throw new Error('Passwords do not match');
	supabase.auth.updateUser({
		password: data.newPassword,
	});

	revalidatePath('/', 'layout');
	redirect('/account/login');
}

export const setRole = async (role: string) => {
	const supabase = createClient();
	let redirectPath = '';

	try {
		const roleSchema = z
			.object({
				role: z.string(),
			})
			.parse({ role });

		const userRole = z
			.enum(['admin', 'doctor', 'user', 'nurse'])
			.parse(roleSchema.role);

		if (!userRole) throw new Error('Invalid role');

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			redirectPath = '/account/login';
		} else {
			const { error } = await supabase
				.from('users')
				.update({ role: role })
				.eq('user_id', user?.id);
			if (error) throw new Error(error.message);

			revalidatePath('/', 'layout');
			switch (role) {
				case 'admin':
					redirectPath = '/admin/dashboard';
					break;
				case 'doctor':
					redirectPath = '/doctor/dashboard';
					break;
				case 'user':
					redirectPath = '/user/dashboard';
					break;
				default:
					redirectPath = '/account/role';
					break;
			}
		}
	} catch (error) {
		console.error('Error setting role: ', error);
		// Handle the error appropriately...
	}

	redirect(redirectPath);
};
