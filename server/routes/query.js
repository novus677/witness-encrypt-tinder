const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Commitment = require('../models/Commitment');
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

        if (!group.members.map(member => member._id.toString()).includes(req.user)) {
            return res.status(403).send({ message: "Access denied" });
        }

        res.status(200).send({
            message: "Query successful",
            groupName: group.name,
            members: group.members,
            params: group.params,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/commitment/:groupId', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate({ path: 'commitments', populate: { path: 'user', select: 'username' } });
        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        if (!group.members.map(member => member._id.toString()).includes(req.user.toString())) {
            return res.status(403).send({ message: "Access denied" });
        }

        res.status(200).send({
            message: "Query successful",
            commitments: group.commitments,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;
