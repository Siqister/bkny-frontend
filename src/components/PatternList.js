import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import axios from 'axios';

import { AUTH_TOKEN, API_ROOT } from '../config';
import Pattern from './Pattern';

const PatternList = () => {

	const [openPattern, setOpenPattern] = useState(null);
	const [isFetching, setIsFetching] = useState(false);
	const [patterns, setPatterns] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN);
		axios.get(`${API_ROOT}/patterns`, {
			headers: {
				"x-access-token": token
			}
		})
			.then(res => {
				if(res.status === 200){
					setPatterns([...res.data]);
				}else{
					setError(res.status);
				}
			})
			.catch(err => setError('Error loading patterns'));
	}, []); 
	// by default useEffect runs after every render; second params makes sure it's only run at componentDidMount
	// https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once

	return <div className='pattern-list'>
		<TextField 
			id="pattern-filter" 
			size='small' 
			variant="outlined" 
			style={{width: '100%'}}
			InputProps={{
				startAdornment: <InputAdornment position='start'><SearchRoundedIcon /></InputAdornment>
			}}
		/>
		<div className='pattern-list-status' style={{ margin: '1rem 0' }}>
			{patterns.length>0 &&<span className='anno'>
				{error? error: `Choose from ${patterns.length} of ${patterns.length} patterns:`}
			</span>}
		</div>
		{patterns.map(x => <Pattern key={x.id} {...x} open={x.id===openPattern} onToggle={id => setOpenPattern(id)} />)}
	</div>

}

export default PatternList;