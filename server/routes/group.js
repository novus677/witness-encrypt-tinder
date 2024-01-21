const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Group = require('../models/Group');
const User = require('../models/User');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const creatorId = req.user;

        const creator = await User.findById(creatorId);
        if (!creator) {
            return res.status(400).send({ message: "User not found" });
        }
        const newGroup = await Group({
            name: groupName,
            creator: creatorId,
            members: [creator],
        });
        await newGroup.save();

        creator.groupsCreated.push(newGroup._id);
        await creator.save();

        res.status(201).send({
            message: "Group created successfully",
            groupId: newGroup._id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to create group" });
    }
});

router.post('/add-user', authMiddleware, async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).send({ message: "User already in group" });
        }

        group.members.push(userId);
        await group.save();

        user.groupsAdded.push(groupId);
        await user.save();

        res.status(201).send({ message: "User added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add user" });
    }
});

module.exports = router;
