// contentRoutes.ts

import express from 'express';
import { createContent, editContent, publishContent, getContent, searchContent } from '../controllers/contentController';

const router = express.Router();

// POST /api/content/create
router.post('/create', createContent);

// PUT /api/content/edit/:id
router.put('/edit/:id', editContent);

// PUT /api/content/publish/:id
router.put('/publish/:id', publishContent);

// GET /api/content/:id
router.get('/:id', getContent);

// GET /api/content/search
router.get('/search', searchContent);

export default router;
