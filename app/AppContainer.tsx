'use client';
import React from 'react';

import { AuthContextProvider } from './context/AuthContext';

const AppContainer = ({ children }) => {
	return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default AppContainer;
