import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from '../../pages/Client/Index';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<Index />} />
			<Route path='/admin' element={<Index />} />
		</Routes>
	);
};

export default AppRouter;
