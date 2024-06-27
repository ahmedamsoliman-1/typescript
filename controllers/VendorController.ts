import { Request, Response, NextFunction } from "express";
import { VendorLoginInputs, EditVendorInputs, CreateFoodInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { ValidatePassword, GenerateSignature } from "../utility";
import { Food } from "../models";

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
            return res.json(signature);
        } else {
            return res.json({ "message": "Incorrect password" });
        }
    } else {
        return res.json({ "message": "Vendor not found" });
    }
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            return res.json(exsistingVendor);
        } else {
            return res.json({ "message": "Vendor not found" });
        }
    } else {
        return res.json({ "message": "User not found" });
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
            return res.json(saveResult);
        } else {
            return res.json({ "message": "Vendor not found" });
        }
    } else {
        return res.json({ "message": "User not found" });
    }
};

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor) {
            exsistingVendor.serviceAvaiable = !exsistingVendor.serviceAvaiable;
            const saveResult = await exsistingVendor.save();
            return res.json(saveResult);
        } else {
            return res.json({ "message": "Vendor not found" });
        }
    } else {
        return res.json({ "message": "User not found" });
    }
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const { name, description, price, category, foodType, readyTime } = <CreateFoodInputs>req.body;
        const vendor = await FindVendor(user._id);
        if (vendor !== null) {
            const createdFood = await Food.create( {
                vendorId: vendor._id, 
                name: name, 
                description: description,
                price: price,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                images: ['mock.jpeg'],
                rating: 0
            });
            vendor.foods.push(createdFood);
            const result = await vendor.save();
            return res.json(result);
        }
    } else {
        return res.json({ "message": "User not found" });
    }
};

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const foods = await Food.find( { vendorId: user._id }); 
        if (foods !== null) {
            return res.json(foods);
        }
    } else {
        return res.json({ "message": "User not found" });
    }
};