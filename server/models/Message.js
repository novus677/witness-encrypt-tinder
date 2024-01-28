const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    commitment: { type: mongoose.Schema.Types.ObjectId, ref: 'Commitment', required: true },
    content: {
        ciphertext: { type: Number },
        proj_key_bytes: { type: Buffer },
        rand_bytes: { type: Buffer },
    },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
