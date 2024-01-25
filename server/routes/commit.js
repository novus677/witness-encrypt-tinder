const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Commitment = require('../models/Commitment');
const Group = require('../models/Group');
const User = require('../models/User');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { groupId, value } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).send({ message: "Group not found" });
        }

        const userId = req.user;
        if (!group.members.map(member => member._id.toString()).includes(userId.toString())) {
            return res.status(403).send({ message: "Access denied" });
        }

        const newCommitment = await Commitment({ user: userId, group: groupId, value });
        await newCommitment.save();
        group.commitments.push(newCommitment._id);
        await group.save();

        res.status(201).send({
            message: "Successfully saved commitment",
            commitmentId: newCommitment._id,
        });
    } catch (err) {
        res.status(500).send({ message: "Failed to save commitment", err });
    }
});

module.exports = router;
