import LogoImage from '@assets/images/logo_instagram.png';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
const Header: React.FC = () => {
	return (
		<div className='flex h-12 items-center justify-between px-8 shadow-md sm:px-10'>
			<Link to='/' className='h-full'>
				<img
					src={LogoImage}
					alt='Logo'
					className='h-full object-contain'
				/>
			</Link>
			<FontAwesomeIcon
				icon={faBars}
				size='lg'
				className='cursor-pointer'
			/>
		</div>
	);
};

export default Header;
