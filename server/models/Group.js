const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    membersCommitted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    membersEncrypted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commitments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commitment' }],
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
