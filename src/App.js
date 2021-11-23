import React, { useState } from 'react';

import Header from './components/Header';
import Login from './components/Login';
import PatternList from './components/PatternList';
import { AUTH_TOKEN, TOKEN_EXP } from './config';

const App = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(
		(!!localStorage.getItem(AUTH_TOKEN)) &&
		new Date() < new Date(localStorage.getItem(TOKEN_EXP))
	); //TODO

	return <div className='app'>
		<Header />
		{!isLoggedIn && <Login onLoginSuccess={() => {
			console.log('App:login success');
			setIsLoggedIn(true);
		}}/>}
		{isLoggedIn && <PatternList />}
	</div>
}

export default App;