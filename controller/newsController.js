const { fetchArticles, findCachedArticle } = require('../models/newsModel');
const { readAll, writeAll } = require('../models/userModel');
const { getPreferences } = require('./userController');
const { createError } = require('../utils/createError');

const getNewsForUser = async (userId) => {
    const preferences = await getPreferences(userId);

    // Nothing to search for, so skip the API call
    if (preferences.length === 0) {
        return [];
    }

    // Quotes keep multi-word preferences like "video games" together
    const query = preferences.map((pref) => `"${pref}"`).join(' OR ');
    return fetchArticles(query);
};

const searchNews = async (keyword) => {
    return fetchArticles(keyword.trim().toLowerCase());
};

// listName is 'readArticles' or 'favoriteArticles'
const saveArticle = async (userId, articleId, listName) => {
    const article = findCachedArticle(articleId);
    if (!article) {
        throw createError(404, 'Article not found. Get /news or search first, then use an id from the results');
    }

    const users = await readAll();
    const user = users.find((user) => user.id === userId);
    if (!user) {
        throw createError(404, 'User not found');
    }

    // Users registered before this feature don't have the lists yet
    user[listName] = user[listName] || [];
    if (!user[listName].find((saved) => saved.id === articleId)) {
        user[listName].push(article);
        await writeAll(users);
    }
    return article;
};

const getSavedArticles = async (userId, listName) => {
    const users = await readAll();
    const user = users.find((user) => user.id === userId);
    if (!user) {
        throw createError(404, 'User not found');
    }
    return user[listName] || [];
};

const markAsRead = (userId, articleId) => saveArticle(userId, articleId, 'readArticles');
const markAsFavorite = (userId, articleId) => saveArticle(userId, articleId, 'favoriteArticles');
const getReadArticles = (userId) => getSavedArticles(userId, 'readArticles');
const getFavoriteArticles = (userId) => getSavedArticles(userId, 'favoriteArticles');

module.exports = {
    getNewsForUser,
    searchNews,
    markAsRead,
    markAsFavorite,
    getReadArticles,
    getFavoriteArticles,
};
