import express, { Request, Response, NextFunction } from 'express';
import { GetVencorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers';
import { Authenticate } from '../middlewares';
const router = express.Router();

router.post('/login', VendorLogin);

router.use(Authenticate);

router.get('/profile', GetVencorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello Vendor')
});

export { router as VendorRoute }