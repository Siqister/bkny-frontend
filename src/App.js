import React, { useState } from 'react';

import Header from './components/Header';
import Login from './components/Login';
import PatternList from './components/PatternList';
import { AUTH_TOKEN } from './config';

const App = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem(AUTH_TOKEN)); //TODO: check for existing, unexpired token

	return <div>
		<Header />
		{!isLoggedIn && <Login onLoginSuccess={() => {
			console.log('App:login success');
			setIsLoggedIn(true);
		}}/>}
		{isLoggedIn && <PatternList />}
	</div>
}

export default App;