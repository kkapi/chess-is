const Router = require('express').Router;

const authMiddleware = require('../middlewares/auth-middleware');
const complaintController = require('../controllers/complaint-controller');

const router = new Router();

router.get('/all', complaintController.getAllComplaints); //authMiddleware

router.post('/new', authMiddleware, complaintController.createComplaint);
router.post('/addReview', complaintController.addReview);

module.exports = router;
