const jwt = require('jsonwebtoken');
const admin = require('./../../../models/admin');
const bcrypt = require('bcrypt');

const pass = 'Technischools!';
const hashPassword = async (password) => await bcrypt.hash(password, 10);

const login = async (req, res) => {
  const response = {
    success: false,
  };

  const account = await admin.findOne({ name: req.body.name });
  let result;

  if (account)
    result = await bcrypt.compare(req.body.password, account.password);

  if (result) {
    response.token = jwt.sign({ name: req.body.name }, pass);
    response.success = true;
  }

  return res.status(200).json(response);
};

const createAdminAccount = async (req, res) => {
  const response = {
    success: false,
  };

  const user = await admin.findOne({ name: req.body.name });

  if (!user && req.body.name && req.body.password) {
    const password = await hashPassword(req.body.password);

    await admin.create({ name: req.body.name, password: password });

    response.success = true;
  }

  return res.status(200).json(response);
};

const checkSession = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: req.body.token && jwt.verify(req.body.token, pass) });
  } catch {
    return res.status(200).json({ success: false });
  }
};

module.exports = {
  login,
  createAdminAccount,
  checkSession,
};
