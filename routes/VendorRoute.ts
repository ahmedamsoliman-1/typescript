import express, { Request, Response, NextFunction } from 'express';
import { AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin, updateVendorCoverImage } from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';


const router = express.Router();


const imageStorage = multer.diskStorage( {
    destination: function(req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname)
    }
});
const images = multer({ storage: imageStorage }).array('images', 10);


router.post('/login', VendorLogin);
router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/cover-image', images, updateVendorCoverImage);
router.patch('/service', UpdateVendorService);

router.post('/food', images, AddFood);
router.get('/foods', GetFoods);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello Vendor')
});

export { router as VendorRoute }