const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim() !== '');

const validateRegister = (req, res, next) => {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (preferences !== undefined && !isStringArray(preferences)) {
        return res.status(400).json({ message: 'preferences must be an array of strings' });
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

const validatePreferences = (req, res, next) => {
    if (!isStringArray(req.body.preferences)) {
        return res.status(400).json({ message: 'preferences must be an array of strings' });
    }
    next();
};

module.exports = { validateRegister, validateLogin, validatePreferences };
