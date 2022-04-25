import axios from 'axios';

const LoginService = {
  login: (data) => axios.post('/api/login', data),
  createAdminAccount: (data) => axios.post('/api/createAdminAccount', data),
  checkSession: (data) => axios.post('/api/checkSession', data),
};

export { LoginService };
