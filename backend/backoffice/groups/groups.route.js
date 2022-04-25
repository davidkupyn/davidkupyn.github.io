const express = require('express');
const router = express.Router();
const groupsService = require('./service');

router.post('/api/groups/get-all-groups', groupsService.getAllGroups);
router.post('/api/groups/create-group', groupsService.createGroup);
router.post('/api/groups/edit-group', groupsService.editGroup);
router.post('/api/groups/delete-group', groupsService.deleteGroup);
router.post('/api/groups/add-to-group', groupsService.addToGroup);
router.post('/api/groups/remove-from-group', groupsService.removeFromGroup);

module.exports = router;
