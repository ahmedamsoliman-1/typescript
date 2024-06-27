import { Request, Response, NextFunction } from "express";
import { VendorLoginInputs, EditVendorInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { ValidatePassword, GenerateSignature } from "../utility";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInputs>req.body;
    const vendor = await FindVendor('', email);
    if (vendor !== null) {

        const isMatched = await ValidatePassword(password, vendor.password, vendor.salt);
        if (isMatched) {
            const signature = GenerateSignature( {
                _id: vendor.id, 
                email: vendor.email, 
                foodTypes: vendor.foodType,
                name: vendor.name
            })
            return res.json(signature);
        } else {
            return res.json({ "message": "Incorrect password" });
        }
    }
}

export const GetVencorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        return res.json(exsistingVendor);
    }
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;
    const user = req.user;
    
    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        exsistingVendor.name = name;
        exsistingVendor.address = address;
        exsistingVendor.phone = phone;
        exsistingVendor.foodType = foodTypes;

        const saveResult = await exsistingVendor.save();
    }

    return res.json( {"message": "Vendor info not found"});
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const exsistingVendor = await FindVendor(user._id);
        if (exsistingVendor !== null) {
            exsistingVendor.serviceAvailable = !exsistingVendor.serviceAvailable;
            const saveResult = await exsistingVendor.save();
            return res.json(saveResult);
        }
    }

    return res.json( {"message": "Unable to change vendor service"});
}