const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const loginApi = require('./backend/backoffice/login');
const usersApi = require('./backend/backoffice/users');
const groupsApi = require('./backend/backoffice/groups');
const config = require('./backend/config/');

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(loginApi);
app.use(usersApi);
app.use(groupsApi);

const PORT = 8080;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT || PORT}`);
});

mongoose.connect(config.hostDB);

mongoose.connection.on('connected', () => {
  console.log('Connected with database');
});
