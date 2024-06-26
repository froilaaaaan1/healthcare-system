'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { logoutSession } from '../auth/actions';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import toast from 'react-hot-toast';
const LogoutButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const logOutAction = async () => {
		setIsLoading(true);
		toast.promise(logoutSession(), {
			loading: 'Logging Out...',
			success: 'Logged Out!',
			error: 'Failed to Log Out',
		});
	}
	return (
		<Button
			variant={'destructive'}
			disabled={isLoading}
			onClick={logOutAction}>
			{isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
			Logout
		</Button>
	);
};

export default LogoutButton;
