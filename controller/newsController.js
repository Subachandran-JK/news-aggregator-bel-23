const { fetchArticles } = require('../models/newsModel');
const { getPreferences } = require('./userController');

const getNewsForUser = async (userId) => {
    const preferences = await getPreferences(userId);

    // Nothing to search for, so skip the API call
    if (preferences.length === 0) {
        return [];
    }

    // Quotes keep multi-word preferences like "video games" together
    const query = preferences.map((pref) => `"${pref}"`).join(' OR ');
    const articles = await fetchArticles(query);

    return articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
    }));
};

module.exports = { getNewsForUser };
