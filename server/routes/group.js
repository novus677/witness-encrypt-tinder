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
        if (err.code === 11000) {
            res.status(409).send({ message: "Group name already exists" });
        } else {
            res.status(500).send({ message: "Server error" });
        }
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
        res.status(500).send({ message: "Server error" });
    }
});

router.post('/done', authMiddleware, async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        if (!group.members.includes(userId)) {
            return res.status(400).send({ message: "User not in group" });
        }

        if (!group.membersCommitted.includes(userId)) {
            group.membersCommitted.push(userId);
            await group.save();
        }

        res.status(200).send({ message: "User marked as done" });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/all-done/:groupId', authMiddleware, async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const allDone = group.membersCommitted.length === group.members.length;
        res.status(200).send({ allDone });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/is-done/:groupId/:userId', authMiddleware, async (req, res) => {
    const { groupId, userId } = req.params;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const done = group.membersCommitted.includes(userId);
        res.status(200).send({ done });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});


module.exports = router;
