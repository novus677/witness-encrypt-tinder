const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    groupsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    groupsAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
