const mongoose = require('mongoose');

const paramsSchema = new mongoose.Schema({
    u1_bytes: { type: Buffer },
    u2_bytes: { type: Buffer },
});

const Params = mongoose.model('Params', paramsSchema);

module.exports = Params;
