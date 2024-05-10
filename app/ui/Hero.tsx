import React from 'react';
import Link from 'next/link';
import DoctorImage from '@/public/images/hero/hero-doctor.jpg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Hero = () => {
	return (
		<Card className='flex flex-col-reverse md:flex-row p-5 gap-5 rounded-xl'>
			<aside className='flex flex-col justify-around'>
				<div className='flex flex-col justify-start gap-2 md:gap-7'>
					<h1 className='text-2xl md:text-4xl font-bold'>
						Crafting Care for your Holistic Health and Better Life
					</h1>
					<p className='text-xl'>
						At our wellness center, we believe in the transformative power of
						personalized care. We understand that true well-being encompasses
						not only physical health but also emotional, mental, and spiritual
						balance
					</p>
				</div>
				<div className='flex mt-5 flex-row gap-5 w-full'>
					<Button>
						<Link
							className=''
							href={'/appointment'}>
							Book an Appointment
						</Link>
					</Button>
					<Button variant={'outline'}>
						<Link
							className='text-base hidden md:flex'
							href={'/our-services'}>
							Our Services
						</Link>
					</Button>
				</div>
			</aside>
			<figure>
				<Image
					className='rounded-xl w-full md:w-96 h-96 md:h-96 object-cover'
					src={DoctorImage}
					alt='A Doctor'
				/>
			</figure>
		</Card>
	);
};

export default Hero;
