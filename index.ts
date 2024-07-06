// import 'newrelic'
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import { AdminRoute, VendorRoute } from "./routes";
import { MONGO_URI } from './config';
import logger from "./utility/logger";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);

mongoose.connect(MONGO_URI, {
}).then(result => {
    logger.info('MongoDB Connected', { method: 'db' });
}).catch(err => {
    console.log(err);
})

app.listen(8000, () => {
    logger.info(`Server is running on port 3000`, { method: 'startup' });
});