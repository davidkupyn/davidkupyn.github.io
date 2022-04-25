import React from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { LoginService } from '../services/login.service';

const CheckSession = () => {
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies['token']) navigate('/');
    (async () => {
      const res = await LoginService.checkSession({ token: cookies['token'] });
      if (!res.data.success) navigate('/');
    })();
  }, []);

  return null;
};

export default CheckSession;
