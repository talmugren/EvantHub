const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    logger.error("MongoDB connection error", err);
    process.exit(1);
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// نموذج المستخدم في قاعدة البيانات
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// API لإنشاء مستخدم جديد
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;
        const newUser = new User({ fullName, email, username, password });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// API للحصول على بيانات المستخدم
app.get('/api/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// API لتحديث بيانات المستخدم
app.put('/api/user/:username', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// تقديم صفحة التسجيل
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
