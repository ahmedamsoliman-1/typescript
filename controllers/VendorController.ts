import { Request, Response, NextFunction } from "express";
import { VendorLoginInputs, EditVendorInputs, CreateFoodInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { ValidatePassword, GenerateSignature } from "../utility";
import { Food } from "../models";
import logger from "../utility/logger";
import { 
    makeResponseForSuccess, 
    makeResponseForFailed, 
    makeResponseForBadRequest, 
    makeResponseForUnauthenticated 
} from "../utility";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInputs>req.body;
    try {
        const vendor = await FindVendor('', email);
        if (vendor !== null) {
            const isMatched = await ValidatePassword(password, vendor.password, vendor.salt);
            if (isMatched) {
                const signature = GenerateSignature({
                    _id: vendor.id,
                    email: vendor.email,
                    foodTypes: vendor.foodType,
                    name: vendor.name
                });
                logger.info(`Vendor login successful: ${email}`, { method: req.method } );
                return makeResponseForSuccess({ res, message: 'Login successful', result: { signature } });
            } else {
                logger.warn(`Incorrect password for vendor: ${email}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Incorrect password' });
            }
        } else {
            logger.warn(`Vendor not found: ${email}`, { method: req.method } );
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } catch (error) {
        logger.error(`Vendor login error: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Login failed' });
    }
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        if (user) {
            const exsistingVendor = await FindVendor(user._id);
            if (exsistingVendor) {
                logger.info(`Vendor profile fetched for user: ${user._id}`, { method: req.method } );
                return makeResponseForSuccess({ res, result: exsistingVendor });
            } else {
                logger.warn(`Vendor not found for user: ${user._id}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Vendor not found' });
            }
        } else {
            logger.warn('User not found', { method: req.method } );
            return makeResponseForFailed({ res, message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error fetching vendor profile: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Error fetching profile' });
    }
};

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;
    const user = req.user;
    try {
        if (user) {
            const exsistingVendor = await FindVendor(user._id);
            if (exsistingVendor) {
                exsistingVendor.name = name;
                exsistingVendor.address = address;
                exsistingVendor.phone = phone;
                exsistingVendor.foodType = foodTypes;

                const saveResult = await exsistingVendor.save();
                logger.info(`Vendor profile updated for user: ${user._id}`, { method: req.method } );
                return makeResponseForSuccess({ res, result: saveResult });
            } else {
                logger.warn(`Vendor not found for user: ${user._id}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Vendor not found' });
            }
        } else {
            logger.warn('User not found', { method: req.method } );
            return makeResponseForFailed({ res, message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error updating vendor profile: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Error updating profile' });
    }
};

export const updateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        if (user) {
            const exsistingVendor = await FindVendor(user._id);
            if (exsistingVendor) {
                const files = req.files as [Express.Multer.File];
                const images = files.map((file: Express.Multer.File) => file.filename);
                exsistingVendor.coverImages.push(...images);
                const saveResult = await exsistingVendor.save();
                logger.info(`Vendor cover image updated for user: ${user._id}`, { method: req.method } );
                return makeResponseForSuccess({ res, result: saveResult });
            } else {
                logger.warn(`Vendor not found for user: ${user._id}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Vendor not found' });
            }
        } else {
            logger.warn('User not found', { method: req.method } );
            return makeResponseForFailed({ res, message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error updating vendor cover image: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Error updating cover image' });
    }
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        if (user) {
            const exsistingVendor = await FindVendor(user._id);
            if (exsistingVendor) {
                exsistingVendor.serviceAvaiable = !exsistingVendor.serviceAvaiable;
                const saveResult = await exsistingVendor.save();
                logger.info(`Vendor service availability updated for user: ${user._id}`, { method: req.method } );
                return makeResponseForSuccess({ res, result: saveResult });
            } else {
                logger.warn(`Vendor not found for user: ${user._id}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Vendor not found' });
            }
        } else {
            logger.warn('User not found', { method: req.method } );
            return makeResponseForFailed({ res, message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error updating vendor service availability: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Error updating service availability' });
    }
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
        if (user) {
            const { name, description, price, category, foodType, readyTime } = <CreateFoodInputs>req.body;
            const vendor = await FindVendor(user._id);
            if (vendor !== null) {
                const files = req.files as [Express.Multer.File];
                const images = files.map((file: Express.Multer.File) => file.filename);
                const createdFood = await Food.create({
                    vendorId: vendor._id, 
                    name: name, 
                    description: description,
                    price: price,
                    category: category,
                    foodType: foodType,
                    readyTime: readyTime,
                    images: images,
                    rating: 0
                });
                vendor.foods.push(createdFood);
                const result = await vendor.save();
                logger.info(`Food item added for vendor: ${vendor._id}`, { method: req.method } );
                return makeResponseForSuccess({ res, result });
            } else {
                logger.warn(`Vendor not found for user: ${user._id}`, { method: req.method } );
                return makeResponseForFailed({ res, message: 'Vendor not found' });
            }
        } else {
            logger.warn('User not found', { method: req.method } );
            return makeResponseForFailed({ res, message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error adding food item: ${error}`, { method: req.method } );
        return makeResponseForFailed({ res, message: 'Error adding food item' });
    }
};
       
export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id }); 
        if (foods !== null) {
            logger.info(`Fetched foods for vendor: ${user._id}`, { method: req.method } );
            return makeResponseForSuccess({ res, result: foods });
        } else {
            logger.warn(`No foods found for vendor: ${user._id}`, { method: req.method } );
            return makeResponseForFailed({ res, message: 'No foods found' });
        }
    } else {
        logger.warn('User not found', { method: req.method } );
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};