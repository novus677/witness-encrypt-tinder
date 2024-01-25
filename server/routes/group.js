const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Group = require('../models/Group');
const User = require('../models/User');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const params = req.body.params;
        const creatorId = req.user;

        const creator = await User.findById(creatorId);
        if (!creator) {
            return res.status(400).send({ message: "User not found" });
        }
        const newGroup = await Group({
            name: groupName,
            creator: creatorId,
            members: [creator],
            params: params,
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

router.post('/add-users', authMiddleware, async (req, res) => {
    try {
        const { groupId, usernames } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const usersToAdd = await User.find({ username: { $in: usernames } });
        const userIdsToAdd = usersToAdd
            .filter(user => !group.members.includes(user._id))
            .map(user => user._id);

        userIdsToAdd.forEach(userId => {
            group.members.push(userId);
        });
        await group.save();

        userIdsToAdd.forEach(async (userId) => {
            const user = await User.findById(userId);
            user.groupsAdded.push(groupId);
            await user.save();
        });

        res.status(201).send({ message: `${userIdsToAdd.length} users added successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add users" });
    }
});

module.exports = router;
