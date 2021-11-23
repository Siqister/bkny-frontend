import React, { useState, useEffect, useRef } from 'react';

import { Slider, Button, Stack, IconButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { format } from 'd3-format';

import { AUTH_TOKEN, API_ROOT } from '../config';
import axios from 'axios';

const formatTime = seconds => {
	const f = format('02');
	const m = Math.floor(seconds/60);
	const s = seconds%60;
	return `${f(m)}:${f(s)}`
}

const Pattern = ({ name, id, desc, open, onToggle }) => {

	const [duration, setDuration] = useState(60);
	const [clock, setClock] = useState(0);
	const [delay, setDelay] = useState(0);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	// clock ref
	// deal with gotcha where setTimeout only uses the initial state value
	// https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
	const clockRef = useRef(clock);
	clockRef.current = clock;

	const activatePattern = () => {
		setIsFetching(true);

		axios.get(`${API_ROOT}/activate/${id}`, {
			params: { duration, delay },
			headers: { 'x-access-token': localStorage.getItem(AUTH_TOKEN) }
		}).then(res => {
			if(res.status===200){
				setIsFetching(false);
				setClock(res.data.duration);
				console.log(res.data);

				// assume countdown starts when Flex Curb API resolves status 200
				let t0 = new Date();

				const countdown = () => {
					setTimeout(() => {
						const t1 = new Date();
						const elapsed = t1-t0;
						t0 = t1;
						const remaining = Math.max(0, Math.round(clockRef.current - elapsed/1000));
						setClock(remaining);
						if(remaining > 0){
							countdown();
						}
					}, 1000);
				}

				countdown();
			}else{
				setIsFetching(false);
				setError({ text: res.data });
			}
		}).catch(err => {
			if(err.response){
				setIsFetching(false);
				setError({ text: err.response.data });
			}else{
				setIsFetching(false);
				setError({ text: 'Error occurred while activating pattern' });
			}
		})
	}

	return <div className='pattern' style={{
		//borderBottom: '1px solid rgba(255, 255, 255, .2)',
		position: 'relative',
		background: 'rgba(255, 255, 255, .05)',
		marginBottom: '.5rem',
		borderRadius: '4px'
	}}>
		<div className='pattern-bg' style={{
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			width: `${clock/duration*100}%`,
			background: 'linear-gradient(90deg, rgba(0,255,209,.01) 0%, rgba(0,255,209,.9) 100%)',
			zIndex: -999
		}} />
		<div style={{ 
			padding: '0 8px' 
		}}>
			<div className='heading' 
				style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
				onClick={() => {
					if(open){
						onToggle(null);
					}else{
						onToggle(id);
					}
				}}
			>
				<span style={{display: 'flex', alignItems: 'center'}}>
					{clock > 0? <LightModeOutlinedIcon />:<AccessTimeRoundedIcon />}
					<h2 style={{ marginLeft: '8px' }}>{name}</h2>
				</span>
				<span style={{display: 'flex', alignItems: 'center'}}>
					{
						open && <LoadingButton 
							variant='outlined' 
							size='small' 
							loading={isFetching || clock>0}
			        loadingPosition="start"
			        startIcon={<PlayArrowRoundedIcon />}
							onClick={e => {
								e.stopPropagation();
								activatePattern();
						}}>
							{isFetching? 'Wait...':(clock>0? `${formatTime(clock)}`: 'RUN')}
						</LoadingButton>
					}
					<IconButton arial-label='toggle' variant='outlined'>
						{open? <KeyboardArrowUpRoundedIcon style={{ color: 'white' }}/> : <KeyboardArrowDownRoundedIcon style = {{ color: 'white' }}/>}
					</IconButton>
				</span>
			</div>
			{open && <div className='options' style={{paddingBottom: '1rem'}}>
				<Stack direction='row' space={2} style={{alignItems: 'center'}}>
					<span className='anno' style={{width: '8rem'}}>Duration</span>
					<Slider 
						disabled={isFetching || clock>0} 
						aria-label='duration-slider' 
						value={duration} 
						step={5}
						min={10}
						max={15*60} 
						onChange={(e,v) => {
							setDuration(v);
						}}
						valueLabelDisplay='auto'
					/>
					<span className='anno' style={{width: '6rem', textAlign: 'right'}}>{`${formatTime(duration)}`}</span>
				</Stack>
				<Stack direction='row' space={2} style={{alignItems: 'center'}}>
					<span className='anno' style={{width: '8rem'}}>Delay</span>
					<Slider 
						disabled={isFetching || clock>0} 
						aria-label='delay-slider' 
						value={delay} 
						step={5}
						max={5*60} 
						onChange={(e,v) => setDelay(v)}
						valueLabelDisplay='auto'
					/>
					<span className='anno' style={{width: '6rem', textAlign: 'right'}}>{`${formatTime(delay)}`}</span>
				</Stack>
			</div>}
		</div>
	</div>

}

export default Pattern;