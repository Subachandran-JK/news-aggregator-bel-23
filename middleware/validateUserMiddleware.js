const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (preferences !== undefined && !Array.isArray(preferences)) {
        return res.status(400).json({ message: 'preferences must be an array' });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }
    next();
};

module.exports = { validateRegister, validateLogin };
