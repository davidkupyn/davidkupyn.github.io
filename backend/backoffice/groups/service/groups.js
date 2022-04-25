const groups = require('./../../../models/groups');
const persons = require('./../../../models/persons');

const getAllGroups = async (req, res) => {
  const response = {
    success: false,
  };

  let allGroups = await groups.find();
  allGroups = allGroups.filter((e) => e.active);
  if (!!allGroups.length) response.success = true;
  response.groups = allGroups;

  return res.status(200).json(response);
};

const createGroup = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  let checkGroup = [];
  if (req.body.email) checkUser = await groups.find({ email: req.body.email });

  if (checkGroup.length === 0) {
    const group = await groups.create({
      name: req.body.name,
      userid: req.body.userIds || [],
    });

    if (group) response.success = true;
  } else response.message = 'Grupa pod taką nazwą już istnieje';

  return res.status(200).json(response);
};
const editGroup = async (req, res) => {
  const response = {
    success: false,
  };

  const group = await groups.updateOne(
    { _id: req.body.id },
    {
      name: req.body.name,
    }
  );
  if (group) response.success = true;

  return res.status(200).json(response);
};
const deleteGroup = async (req, res) => {
  const response = {
    success: false,
  };

  await groups.updateOne({ _id: req.body.id }, { active: false });
  response.success = true;

  return res.status(200).json(response);
};

const addToGroup = async (req, res) => {
  const response = {
    success: false,
  };

  const group = await groups.findOne({ _id: req.body.groupId });
  if (group && req.body.userId && !group.userid.includes(req.body.userId)) {
    group.userid.push(req.body.userId);

    await groups.updateOne({ _id: req.body.groupId }, group);
    response.success = true;
  }

  return res.status(200).json(response);
};

const removeFromGroup = async (req, res) => {
  const response = {
    success: false,
  };

  const group = await groups.findOne({ _id: req.body.groupId });
  if (group && req.body.userId) {
    group.userid = group.userid.filter((_) => _ != req.body.userId);

    await groups.updateOne({ _id: req.body.groupId }, group);
    response.success = true;
  }

  return res.status(200).json(response);
};

module.exports = {
  getAllGroups,
  createGroup,
  editGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
};
