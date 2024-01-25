const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');
const groupRoutes = require('./routes/group');
const commitRoutes = require('./routes/commit');
// const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const MONGO_CONNECTION_URL = "mongodb://localhost:27017/local_test_db";

mongoose.connect(MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/routes/auth', authRoutes);
app.use('/routes/query', queryRoutes);
app.use('/routes/group', groupRoutes);
app.use('/routes/commit', commitRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
