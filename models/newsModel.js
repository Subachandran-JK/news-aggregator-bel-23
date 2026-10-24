const axios = require('axios');
const { createError } = require('../utils/createError');

const newsApi = axios.create({
    baseURL: 'https://newsapi.org/v2',
    timeout: 5000,
});

const fetchArticles = async (query) => {
    try {
        const response = await newsApi.get('/everything', {
            params: { q: query, language: 'en', sortBy: 'publishedAt', pageSize: 20 },
            headers: { 'X-Api-Key': process.env.NEWS_API_KEY },
        });
        return response.data.articles;
    } catch (err) {
        // No response means timeout or network problem
        if (!err.response) {
            throw createError(503, 'News service is unavailable, please try again later');
        }
        if (err.response.status === 429) {
            throw createError(503, 'News service limit reached, please try again later');
        }
        console.error('NewsAPI error:', err.response.status, err.response.data.message);
        throw createError(502, 'Failed to fetch news');
    }
};

module.exports = { fetchArticles };
