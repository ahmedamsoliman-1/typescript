import { Request, Response, NextFunction } from "express";
import { VendorLoginInputs, EditVendorInputs, CreateFoodInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { ValidatePassword, GenerateSignature } from "../utility";
import { Food } from "../models";
import { 
    makeResponseForSuccess, 
    makeResponseForFailed, 
    makeResponseForBadRequest, 
    makeResponseForUnauthenticated 
} from "../utility";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInputs>req.body;
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
            return makeResponseForSuccess({ res, message: 'Login successful', result: { signature } });
        } else {
            return makeResponseForFailed({ res, message: 'Incorrect password' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'Vendor not found' });
    }
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            return makeResponseForSuccess({ res, result: exsistingVendor });
        } else {
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;
    const user = req.user;

    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            exsistingVendor.name = name;
            exsistingVendor.address = address;
            exsistingVendor.phone = phone;
            exsistingVendor.foodType = foodTypes;

            const saveResult = await exsistingVendor.save();
            return makeResponseForSuccess({ res, result: saveResult });
        } else {
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};

export const updateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename);
            exsistingVendor.coverImages.push(...images);
            const saveResult = await exsistingVendor.save();
            return makeResponseForSuccess({ res, result: saveResult });
        } else {
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            exsistingVendor.serviceAvaiable = !exsistingVendor.serviceAvaiable;
            const saveResult = await exsistingVendor.save();
            return makeResponseForSuccess({ res, result: saveResult });
        } else {
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

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
            return makeResponseForSuccess({ res, result });
        } else {
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id }); 
        if (foods !== null) {
            return makeResponseForSuccess({ res, result: foods });
        } else {
            return makeResponseForFailed({ res, message: 'No foods found' });
        }
    } else {
        return makeResponseForFailed({ res, message: 'User not found' });
    }
};
