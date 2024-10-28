import WarningImage from '@assets/images/warning.png';
import { faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
	const getTodayText = (): string => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		return new Date().toLocaleDateString('en-US', options);
	};
	const todayText = getTodayText();

	return (
		<div className='flex items-center justify-center'>
			<div className='w-full max-w-md rounded-lg bg-white sm:border'>
				<div className='border-b p-8 pb-4 text-left'>
					<img
						src={WarningImage}
						alt='Security Alert'
						className='mb-4 rounded-t-lg'
					/>
					<h2 className='mt-6 text-2xl font-bold text-gray-900'>
						Important Security Notice
					</h2>
				</div>
				<div className='p-8 py-4'>
					<b className='mb-4 text-sm text-gray-900'>
						What this means
					</b>
					<p className='mb-2 text-sm text-gray-600'>
						We've detected unusual activity on your Instagram
						account. For your safety, access to your linked pages
						has been temporarily limited.
					</p>
					<p className='mb-2 text-sm text-gray-600'>
						Suspended on {todayText}
					</p>
					<div className='mb-4'>
						<b className='mb-2 text-sm text-gray-900'>
							Why this happened
						</b>
						<div className='mb-2 flex items-center text-sm text-gray-500'>
							<FontAwesomeIcon
								icon={faInfoCircle}
								className='mr-2 h-4 w-4'
							/>
							<a
								href='/live'
								className='transition duration-150 ease-in-out hover:text-blue-500'
							>
								Learn more about account security
							</a>
						</div>
						<div className='flex items-center text-sm text-gray-500'>
							<FontAwesomeIcon
								icon={faBook}
								className='mr-2 h-4 w-4'
							/>
							<a
								href='/live'
								className='transition duration-150 ease-in-out hover:text-blue-500'
							>
								Read more about this rule
							</a>
						</div>
					</div>
					<b className='mb-4 text-sm text-gray-900'>
						What you can do
					</b>
					<p className='text-sm text-gray-600'>
						Complete our enhanced security check to restore full
						access to your account and linked pages.
					</p>
				</div>
				<div className='border-t px-8 py-4'>
					<Link
						to='/home'
						className='bg-primary hover:bg-primary/80 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out'
					>
						Appeal
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Index;
