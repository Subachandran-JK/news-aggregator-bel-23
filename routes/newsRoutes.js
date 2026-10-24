const express = require('express');
const { getNewsForUser } = require('../controller/newsController');
const { isAuthorized } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(isAuthorized);

router.get('/', async (req, res) => {
    const news = await getNewsForUser(req.decodedToken.id);
    res.status(200).json({ news });
});

module.exports = router;
