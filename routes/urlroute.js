import express from 'express';
import { geturl, shortUrl, updateUrl, deleteUrl, getStats } from '../controller/controlUrl.js';

const router = express.Router();

router.post('/shorten', geturl);
router.get('/shorten/:shortCode', shortUrl);
router.put('/shorten/:shortCode', updateUrl);
router.delete('/shorten/:shortCode', deleteUrl);
router.get('/shorten/:shortCode/stats', getStats);





export default router;