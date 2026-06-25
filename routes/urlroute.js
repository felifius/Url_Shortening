import express from 'express';
import { geturl } from '../controllers/urlcontroller.js';

router = express.Router();

router.post('/shorten', geturl);
router.get('/shorten/:shortCode', shortUrl);
router.put('/shorten/:shortCode', updateUrl);
router.delete('/shorten/:shortCode', deleteUrl);
router.get('/shorten/:shortCode/stats', getStats);





export default router;