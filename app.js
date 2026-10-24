require('dotenv').config({ quiet: true });
const express = require('express');
const { logger } = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { initDataFile } = require('./models/userModel');
const userRoutes = require('./routes/userRoutes');

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Add it to your .env file (see .env.example)');
    process.exit(1);
}

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes); // OCP

app.use(notFound);
app.use(errorHandler);

initDataFile()
    .then(() => {
        app.listen(PORT, (err) => {
            if (err) {
                return console.log('Something bad happened', err);
            }
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Could not create the data file', err);
        process.exit(1);
    });

module.exports = app;
