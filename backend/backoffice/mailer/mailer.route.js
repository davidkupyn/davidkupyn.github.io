const express = require('express');
const router = express.Router();
const mailerService = require('./service');

router.post('/api/sendEmail', mailerService.sendEmail);

module.exports = router;
