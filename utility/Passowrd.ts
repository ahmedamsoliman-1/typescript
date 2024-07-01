import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthPayload, VendorPayload } from '../dto';
import { APP_SECRET } from '../config';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async ( enteredPassword: string, savedPassword: string, salt: string) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
}

export const GenerateSignature = (payload: VendorPayload) => {
    try {
        return jwt.sign(payload, APP_SECRET, { expiresIn: '10d' });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const ValidateSignature = async (req: Request) => {
    // try {
    //     const signature = req.get('Authorization');
    //     if (signature) {
    //         const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
    //         req.user = payload;
    //         return true;
    //     }
        
    // } catch (error) {
    //     console.log(error);
    //     return false;
    // }

    const signature = req.get('Authorization');
    if (signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
        req.user = payload;
        return true;
    }
}