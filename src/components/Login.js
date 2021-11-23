import React, { useState } from 'react';
import { Input, Button } from '@mui/material';
import axios from 'axios';

import { AUTH_TOKEN, TOKEN_EXP, API_ROOT } from '../config';

const Login = ({ onLoginSuccess }) => {

	const [formState, setFormState] = useState({
		email: '',
		password: ''
	});
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	const postLogin = () => {
		setError(null);

		axios.post(`${API_ROOT}/login`, {...formState})
			.then(res => {
				localStorage.setItem(AUTH_TOKEN, res.data.token);
				localStorage.setItem(TOKEN_EXP, res.data.tokenExpiry);
				onLoginSuccess();
			})
			.catch(err => {
				if(err.response){
					setError({ text: err.response.data });
				}else{
					setError({ text: 'Error occurred while logging in, please try again later' });
				}
			});
	}

	return <div className='login'>
		<form onSubmit={e => {
			e.preventDefault();
			postLogin();
		}}>
			<Input
				style={{ width: '100%', margin: '0 0 1rem' }}
				type='text'
				placeholder='Email'
				value={formState.email}
				onChange={e => {
					setFormState({ ...formState, email: e.target.value })
				}}
			/>
			<Input
				style={{ width: '100%', margin: '0 0 1rem' }}
				type='password'
				placeholder='Password'
				value={formState.password}
				onChange={e => {
					setFormState({ ...formState, password: e.target.value })
				}}
			/>
			<Button 
				type='submit' 
				variant='contained' 
				disableElevation
				style={{ width: '100%' }}
			>
				Log in
			</Button>
		</form>
		{error && <div className='status' style={{ margin: '1rem 0' }}>
			<span className='anno'>{error.text}</span>
		</div>}
	</div>

}

export default Login;