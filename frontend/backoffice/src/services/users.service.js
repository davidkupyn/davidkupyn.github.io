import axios from 'axios';

const UsersService = {
  getAllUsers: (data) => axios.post('/api/users/get-all-users', data),
  getUser: (data) => axios.post('/api/users/get-user', data),
  addUser: (data) => axios.post('/api/users/add-user', data),
  editUser: (data) => axios.post('/api/users/edit-user', data),
  deleteUser: (data) => axios.post('/api/users/delete-user', data),
};

export { UsersService };
