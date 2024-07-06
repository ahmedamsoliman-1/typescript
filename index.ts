import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import logger from './utility/logger';

const port = 3000;
const StartServer = async() => {
    const app = express();

    await App(app);

    await dbConnection();

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`, { method: 'startup' });
    });
}


StartServer()