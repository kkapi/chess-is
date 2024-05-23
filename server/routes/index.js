const Router = require('express').Router;

const userRouter = require('./userRouter');
const complaintRouter = require('./complaintRouter')

const router = new Router();

router.use('/user', userRouter);
router.use('/complaint', complaintRouter);

module.exports = router;