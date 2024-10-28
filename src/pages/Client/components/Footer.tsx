import FromMetaImage from '@assets/images/from_meta.svg';
import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className='mt-auto w-full py-4'>
			<div className='container mx-auto flex justify-center'>
				<img src={FromMetaImage} alt='from meta' className='h-8' />
			</div>
		</footer>
	);
};

export default Footer;
