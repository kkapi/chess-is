const Router = require('express').Router;
const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');
const ApiError = require('../exceptions/api-error');

const router = new Router();

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/isFreeLogin', userController.isFreeLogin);
router.get('/info/:id', userController.getUserInfo);
router.get('/games/:id', userController.getUserGames);
router.get('/game/:uuid', userController.getGameInfo)

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/recoverpass', userController.recoverPassword);
router.post('/resetpass', userController.resetPassword);
router.post('/changeInfo', userController.chageUserInfo);
router.post('/changepass', userController.changePassword);

module.exports = router;
