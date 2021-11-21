import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import App from './App';
import './style.css';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: 'rgb(41,175,129)',
			light: 'rgb(41,175,129)',
			dark: 'rgb(41,175,129)'
		}
	}
});

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>, 
	document.getElementById('root'));