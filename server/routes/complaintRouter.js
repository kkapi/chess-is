const Router = require('express').Router;

const authMiddleware = require('../middlewares/auth-middleware');
const complaintController = require('../controllers/complaint-controller');

const router = new Router();

router.post('/new', authMiddleware, complaintController.createComplaint);
router.get('/all', complaintController.getAllComplaints) //authMiddleware


module.exports = router;