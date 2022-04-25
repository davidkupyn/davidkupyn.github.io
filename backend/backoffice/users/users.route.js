const express = require('express');
const router = express.Router();
const usersService = require('./service');

router.post('/api/users/get-all-users', usersService.getAllUsers);
router.post('/api/users/get-user', usersService.getUser);
router.post('/api/users/add-user', usersService.addUser);
router.post('/api/users/edit-user', usersService.editUser);
router.post('/api/users/delete-user', usersService.deleteUser);

module.exports = router;
