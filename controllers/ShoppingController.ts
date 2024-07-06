import express, { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor, Offer } from '../models';
import logger from '../utility/logger';
import {
  makeResponseForSuccess,
  makeResponseForFailed,
  makeResponseForBadRequest,
  makeResponseForUnauthenticated
} from '../utility';

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    try {
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate('foods');

        if (result.length > 0) {
            logger.info('Fetched food availability successfully', { method: 'GetFoodAvailability' });
            return makeResponseForSuccess({ res, result });
        }

        logger.warn('No food availability found', { method: 'GetFoodAvailability' });
        return makeResponseForFailed({ res, message: 'Data not found!' });
    } catch (error) {
        logger.error(`Error fetching food availability: ${error}`, { method: 'GetFoodAvailability' });
        return makeResponseForFailed({ res, message: 'Error fetching food availability' });
    }
};

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    try {
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .limit(10);

        if (result.length > 0) {
            logger.info('Fetched top restaurants successfully', { method: 'GetTopRestaurants' });
            return makeResponseForSuccess({ res, result });
        }

        logger.warn('No top restaurants found', { method: 'GetTopRestaurants' });
        return makeResponseForFailed({ res, message: 'Data not found!' });
    } catch (error) {
        logger.error(`Error fetching top restaurants: ${error}`, { method: 'GetTopRestaurants' });
        return makeResponseForFailed({ res, message: 'Error fetching top restaurants' });
    }
};

export const GetFoodsIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    try {
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate('foods');

        if (result.length > 0) {
            let foodResult: any = [];
            result.forEach(vendor => {
                const foods = vendor.foods as [FoodDoc];
                foodResult.push(...foods.filter(food => food.readyTime <= 30));
            });

            logger.info('Fetched foods in 30 mins successfully', { method: 'GetFoodsIn30Min' });
            return makeResponseForSuccess({ res, result: foodResult });
        }

        logger.warn('No foods available in 30 mins', { method: 'GetFoodsIn30Min' });
        return makeResponseForFailed({ res, message: 'Data not found!' });
    } catch (error) {
        logger.error(`Error fetching foods in 30 mins: ${error}`, { method: 'GetFoodsIn30Min' });
        return makeResponseForFailed({ res, message: 'Error fetching foods in 30 mins' });
    }
};

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    try {
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate('foods');

        if (result.length > 0) {
            let foodResult: any = [];
            result.forEach(item => foodResult.push(...item.foods));

            logger.info('Searched foods successfully', { method: 'SearchFoods' });
            return makeResponseForSuccess({ res, result: foodResult });
        }

        logger.warn('No foods found', { method: 'SearchFoods' });
        return makeResponseForFailed({ res, message: 'Data not found!' });
    } catch (error) {
        logger.error(`Error searching foods: ${error}`, { method: 'SearchFoods' });
        return makeResponseForFailed({ res, message: 'Error searching foods' });
    }
};

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const result = await Vendor.findById(id).populate('foods');

        if (result) {
            logger.info('Fetched restaurant by ID successfully', { method: 'RestaurantById' });
            return makeResponseForSuccess({ res, result });
        }

        logger.warn('Restaurant not found by ID', { method: 'RestaurantById' });
        return makeResponseForFailed({ res, message: 'Data not found!' });
    } catch (error) {
        logger.error(`Error fetching restaurant by ID: ${error}`, { method: 'RestaurantById' });
        return makeResponseForFailed({ res, message: 'Error fetching restaurant by ID' });
    }
};

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    try {
        const offers = await Offer.find({ pincode: pincode, isActive: true });

        if (offers) {
            logger.info('Fetched available offers successfully', { method: 'GetAvailableOffers' });
            return makeResponseForSuccess({ res, result: offers });
        }

        logger.warn('Offers not found', { method: 'GetAvailableOffers' });
        return makeResponseForFailed({ res, message: 'Offers not found!' });
    } catch (error) {
        logger.error(`Error fetching offers: ${error}`, { method: 'GetAvailableOffers' });
        return makeResponseForFailed({ res, message: 'Error fetching offers' });
    }
};
