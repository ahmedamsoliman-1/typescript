import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";
import { 
    makeResponseForSuccess, 
    makeResponseForFailed, 
    makeResponseForBadRequest, 
    makeResponseForUnauthenticated 
} from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({ email: email });
    } else {
        return await Vendor.findById(id);
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, pincode, foodTypes, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const exsistingVendor = await FindVendor(undefined, email);
    if (exsistingVendor) {
        return makeResponseForFailed({ res, message: 'A user with that email already exists' });
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const newVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodTypes: foodTypes,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImage: [],
        foods: []
    });

    return makeResponseForSuccess({ res, result: newVendor });
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find();
    if (vendors !== null) {
        return makeResponseForSuccess({ res, result: vendors });
    } else {
        return makeResponseForFailed({ res, message: 'No vendors found' });
    }
}

export const getVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await FindVendor(vendorId);

    if (vendor !== null) {
        return makeResponseForSuccess({ res, result: vendor });
    } else {
        return makeResponseForFailed({ res, message: 'Vendor not found' });
    }
}
