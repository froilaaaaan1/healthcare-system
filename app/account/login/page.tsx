import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginImage from '@/public/images/hero/login-image.jpg';
import Login from '@/app/ui/Forms/Login';

const LogIn = async () => {
	return (
		<>
			<div className='lg:p-8'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col space-y-2 text-center'>
						<h1 className='text-2xl font-semibold tracking-tight'>
							Welcome Back!
						</h1>
						<p className='text-sm text-muted-foreground'>
							Enter your email & password to continue.
						</p>
					</div>
					<Login />
				</div>
			</div>
		</>
	);
};

export default LogIn;
