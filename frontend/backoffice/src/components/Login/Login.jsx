import React, { useState, useEffect } from 'react';
import './Login.scss';
import { LoginService } from './../../services/login.service';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Input from '../Input/Input';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { MdOutlineError } from 'react-icons/md';
import logo_dark from './../../images/techni_logo_white.png';
import logo_light from './../../images/techni_logo_purple.png';

const Login = ({ theme }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(['token']);

  const login = async () => {
    setLoading(true);

    const res = await LoginService.login({ name: user, password: pass });

    if (res.data.success && res.data.token) {
      setCookie('token', res.data.token, { path: '/' });
      window.location.pathname = '/dashboard';
    } else setError(true);

    setLoading(false);
  };

  useEffect(() => {
    if (!cookies['token']) return;
    (async () => {
      const res = await LoginService.checkSession(cookies['token']);
      if (!res.data.success) window.location.pathname = '/dashboard';
    })();
  });

  return (
    <Container className='login_main' maxWidth='xs'>
      <Box className='login_center'>
        <div className='login_paper drop-shadow-xl'>
          <img
            src={theme ? logo_dark : logo_light}
            className='login_paper_logo'
          />

          <Typography className='title' component='span'>
            Logowanie
          </Typography>
          <Grid className='inputs'>
            <Input
              onChange={(e) => {
                setUser(e.target.value);
                setError(false);
              }}
              value={user}
              placeholder='Twój login'
              error={error}
              label='Login'
              fullWidth
            />
            <Input
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              value={pass}
              placeholder='Twoje hasło'
              label='Hasło'
              error={error}
              password={'true'}
              onKeyDown={(e) =>
                `${e.code}`.toLowerCase() === 'enter' && login()
              }
              fullWidth
            />
          </Grid>
          <Typography component='span'>
            {error && (
              <p className='login_error'>
                <MdOutlineError /> Nieprawidłowy użytkownik lub hasło
              </p>
            )}
          </Typography>
          <Grid className='button'>
            <LoadingButton
              loading={loading}
              variant='contained'
              onClick={() => login()}
            >
              Zaloguj się
            </LoadingButton>
          </Grid>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
