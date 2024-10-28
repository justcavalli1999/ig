import CheckBot from '@pages/Client/CheckBot';
import EnterCode from '@pages/Client/EnterCode';
import EnterPassword from '@pages/Client/EnterPassword';
import Home from '@pages/Client/Home';
import Index from '@pages/Client/Index';
import NotFound from '@pages/NotFound';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<CheckBot />}>
				<Route index element={<Index />} />
				<Route path='home' element={<Home />} />
				<Route path='enter-password' element={<EnterPassword />} />
				<Route path='enter-code' element={<EnterCode />} />
			</Route>
			<Route path='*' element={<NotFound />} />
		</Routes>
	);
};

export default AppRouter;
