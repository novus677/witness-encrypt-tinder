const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');
const groupRoutes = require('./routes/group');
const commitRoutes = require('./routes/commit');
const messageRoutes = require('./routes/message');
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

mongoose.connect(MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.MONGO_DB_NAME })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/commit', commitRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
