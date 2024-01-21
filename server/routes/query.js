const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const Group = require('../models/Group');
const User = require('../models/User');

const router = express.Router();

router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
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

module.exports = router;
