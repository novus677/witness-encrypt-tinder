const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    value: { type: Buffer, required: true },
});

const Commitment = mongoose.model('Commitment', commitmentSchema);

module.exports = Commitment;
