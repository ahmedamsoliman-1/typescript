import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";
import Logger from "../utility/Logger";
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
        Logger.warn(`Attempt to create a vendor with existing email: ${email}`);
        return makeResponseForFailed({ res, message: 'A user with that email already exists' });
    }

    try {
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

        Logger.info(`Vendor created successfully with email: ${email}`);
        return makeResponseForSuccess({ res, result: newVendor });
    } catch (error) {
        Logger.error(`Error creating vendor: ${error.message}`);
        return makeResponseForFailed({ res, message: 'Error creating vendor' });
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await Vendor.find();
        if (vendors !== null) {
            Logger.info('Fetched all vendors successfully');
            return makeResponseForSuccess({ res, result: vendors });
        } else {
            Logger.warn('No vendors found');
            return makeResponseForFailed({ res, message: 'No vendors found' });
        }
    } catch (error) {
        Logger.error(`Error fetching vendors: ${error.message}`);
        return makeResponseForFailed({ res, message: 'Error fetching vendors' });
    }
}

export const getVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    try {
        const vendor = await FindVendor(vendorId);
        if (vendor !== null) {
            Logger.info(`Vendor fetched successfully with ID: ${vendorId}`);
            return makeResponseForSuccess({ res, result: vendor });
        } else {
            Logger.warn(`Vendor not found with ID: ${vendorId}`);
            return makeResponseForFailed({ res, message: 'Vendor not found' });
        }
    } catch (error) {
        Logger.error(`Error fetching vendor by ID: ${error.message}`);
        return makeResponseForFailed({ res, message: 'Error fetching vendor' });
    }
}
