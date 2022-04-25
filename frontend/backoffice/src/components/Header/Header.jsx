import './Header.scss';
import { Grid, Tooltip } from '@mui/material';
import React from 'react';
import logo_dark from './../../images/techni_logo_white.png';
import logo_light from './../../images/techni_logo_purple.png';
import { MdLogout } from 'react-icons/md';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

const Header = ({ theme, changeTheme }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  return (
    <div className='header_main'>
      <div className='header_paper drop-shadow-xl'>
        <Grid className='header_content'>
          <img
            src={theme ? logo_dark : logo_light}
            className='logo'
            onClick={() => {
              window.location.pathname = '/dashboard';
            }}
          />
          <div className='flex items-center gap-[10px]'>
            <Tooltip title={`Tryb ${theme ? 'jasny' : 'ciemny'}`}>
              <div className='darkmode' onClick={() => changeTheme()}>
                <div className='spacing'>
                  <div className='toggle-switch'>
                    <svg
                      className={theme ? 'svg' : 'rotated'}
                      width='19px'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 496 496'
                    >
                      <path
                        fill={theme ? '#f0f0f0' : '#3813c2'}
                        d='M8,256C8,393,119,504,256,504S504,393,504,256,393,8,256,8,8,119,8,256ZM256,440V72a184,184,0,0,1,0,368Z'
                        transform='translate(-8 -8)'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Tooltip>
            <Tooltip title='Wyloguj się'>
              <div
                className={`logout cursor-pointer`}
                style={{ color: !theme && '#3813c2' }}
                onClick={() => {
                  removeCookie('token', { path: '/' });
                  window.location.pathname = '/';
                }}
              >
                <MdLogout size={22} />
              </div>
            </Tooltip>
          </div>
          {/* <div>
            <select>
              <option>&#9728;&#65039;</option>
              <option>&#127769;</option>
              <option>&#128421;&#65039;</option>
              na discordzie wyśle ci o co mi chodzi
              https://tailwindcss.com/docs/installation patrz
            </select>
          </div> */}
        </Grid>
      </div>
    </div>
  );
};

export default Header;
