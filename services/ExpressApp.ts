import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute } from "../routes";
import logger from "../utility/logger";
import path from 'path';


export default async(app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use('/images', express.static(path.join(__dirname, 'images')));
    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);

    return app;
}