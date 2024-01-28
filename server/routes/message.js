const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Group = require('../models/Group');
const User = require('../models/User');
const Message = require('../models/Message');

const router = express.Router();

router.post('/send', authMiddleware, async (req, res) => {
    const { sender, receiver, group, commitment, content } = req.body;
    try {
        const newMessage = await Message({ sender, receiver, group, commitment, content });
        await newMessage.save();

        res.status(201).send({
            message: "Message saved successfully",
            messageId: newMessage._id,
        });
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
        if (!group.membersEncrypted.includes(userId)) {
            group.membersEncrypted.push(userId);
            await group.save();
        }
        res.status(200).send({ message: "Updated membersEncrypted" });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/all-done/:groupId', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const allDone = group.membersEncrypted.length === group.members.length;
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

        const done = group.membersEncrypted.includes(userId);
        res.status(200).send({ done });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;
