const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Group = require('../models/Group');
const User = require('../models/User');

const router = express.Router();

router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('groupsCreated', 'name _id').populate('groupsAdded', 'name _id');
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        res.status(200).send({
            message: "Query successful",
            username: user.username,
            groupsCreated: user.groupsCreated,
            groupsAdded: user.groupsAdded,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/group/:groupId', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate('members');
        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }
        res.status(200).send({
            message: "Query successful",
            groupName: group.name,
            members: group.members,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;
