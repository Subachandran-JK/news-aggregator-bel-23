const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readAll, writeAll } = require('../models/userModel');

const SALT_ROUNDS = 10;

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const registerUser = async ({ name, email, password, preferences = [] }) => {
    const users = await readAll();

    if (users.find((user) => user.email === email)) {
        throw createError(400, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    users.push({ id: crypto.randomUUID(), name, email, password: hashedPassword, preferences });
    await writeAll(users);
};

const loginUser = async ({ email, password }) => {
    const users = await readAll();
    const user = users.find((user) => user.email === email);

    // Same error for wrong email and wrong password so we don't leak which emails exist
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createError(401, 'Invalid email or password');
    }

    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { registerUser, loginUser };
