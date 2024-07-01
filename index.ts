// import 'newrelic'
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
// import path from 'path';

import { AdminRoute, VendorRoute } from "./routes";
import { MONGO_URI } from './config';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/images', express.static(path.join(__dirname, '')));


app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);

mongoose.connect(MONGO_URI, {
    // useNewUrlParser: true, 
    // useUnifiedTopology: true
    // useCreateIndex: true
}).then(result => {
    // console.log(result);
    console.log('MongoDB Connected');
}).catch(err => {
    console.log(err);
})

app.listen(8000, () => {
    // console.clear();
    console.log('Server is running on port 3000');
});