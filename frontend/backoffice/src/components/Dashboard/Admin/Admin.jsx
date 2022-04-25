import React, { useState } from 'react';
import './Admin.scss';
import { LoginService } from './../../../services/login.service';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import Input from '../../Input/Input';

const Admin = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const createAdminAccount = async () => {
    const res = await LoginService.createAdminAccount({
      name: user,
      password: pass,
    });
    console.log(res);
  };
  return (
    <Container className='login_main' maxWidth='xs'>
      <Box className='login_center'>
        <Paper className='login_paper' elevation={8}>
          <Typography className='title' component='span'>
            Stwórz konto admina
          </Typography>
          <Grid className='inputs'>
            <Input
              onChange={(e) => setUser(e.target.value)}
              value={user}
              placeholder='Podaj login'
              label='Login'
              fullWidth
            />
            <Input
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              placeholder='Podaj hasło'
              label='Hasło'
              password
              fullWidth
            />
          </Grid>
          <Grid className='button'>
            <Button variant='contained' onClick={() => createAdminAccount()}>
              Stwórz konto
            </Button>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Admin;
