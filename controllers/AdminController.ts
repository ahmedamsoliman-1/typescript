import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const exsistingVendor = await Vendor.findOne({ email: email });
    if (exsistingVendor) {
        return res.json({ message: 'A user with that email already exists' })
    }

    // Generate a salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    
    // Encrypt the password using the salt

    const CreateVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImage: [],

    });

    res.json(CreateVendor)
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello Vendor')
}

export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello Vendor')
}