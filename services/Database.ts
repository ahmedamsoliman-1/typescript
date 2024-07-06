import mongoose from 'mongoose';
import { MONGO_URI } from '../config';
import logger from "../utility/logger";

export default async () => {
    try {
        mongoose.connect(MONGO_URI, {
        }).then(result => {
            logger.info('MongoDB Connected', { method: 'db' });
        }).catch(err => {
            console.log(err);
        })
    } catch {
        logger.error('MongoDB Connection Error', { method: 'db'} );
    }
}
