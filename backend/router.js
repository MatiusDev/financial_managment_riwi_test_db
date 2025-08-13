import express from 'express';

import clientRouter from "./controllers/clientController.js";
import platformRouter from "./controllers/platformController.js";
import invoiceRouter from "./controllers/invoiceController.js";
import transactionRouter from "./controllers/transactionController.js";

const router = express.Router();

router.use('/clients', clientRouter);
router.use('/platforms', platformRouter);
router.use('/invoices', invoiceRouter);
router.use('/transactions', transactionRouter);

export default router;
