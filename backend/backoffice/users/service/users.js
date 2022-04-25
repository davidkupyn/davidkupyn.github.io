const persons = require('./../../../models/persons');

const getUser = async (req, res) => {
  const response = {
    success: false,
  };

  let user = await persons.findOne({ _id: req.body.id, active: true });
  if (user) {
    response.user = user;
    response.success = true;
  }

  return res.status(200).json(response);
};

const getAllUsers = async (req, res) => {
  const response = {
    success: false,
  };

  let allUsers = await persons.find();
  allUsers = allUsers.filter((e) => e.active);

  if (!!allUsers.length) response.success = true;
  response.users = allUsers;

  return res.status(200).json(response);
};

const addUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  let checkUser = [];
  if (req.body.email) checkUser = await persons.find({ email: req.body.email });

  if (checkUser.length === 0) {
    const user = await persons.create({
      type: req.body.type,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email || '',
      telephone: req.body.number || '',
    });

    if (user) response.success = true;
    console.log(user);
  } else response.message = 'Użytkownik z takim adresem email już istnieje';

  return res.status(200).json(response);
};

const editUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  let user, userEmail;
  if (req.body.id) user = await persons.findOne({ _id: req.body.id });
  if (user && req.body.email && user.email != req.body.email)
    userEmail = await persons.findOne({ email: req.body.email });

  if (!userEmail) {
    const user = await persons.updateOne(
      { _id: req.body.id },
      {
        type: req.body.type,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email || '',
        telephone: req.body.number || '',
      }
    );

    if (user) response.success = true;
    console.log(user);
  } else response.message = 'Użytkownik z takim adresem email już istnieje';

  return res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const response = {
    success: false,
  };

  user = await persons.findOne({ _id: req.body.id });
  if (user) {
    await persons.updateOne({ _id: req.body.id }, { active: false });
    response.success = true;
  }

  return res.status(200).json(response);
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
};
