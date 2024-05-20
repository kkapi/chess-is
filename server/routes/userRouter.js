const Router = require('express').Router;
const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');
const ApiError = require('../exceptions/api-error');

const router = new Router();

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/isFreeLogin', userController.isFreeLogin);

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/recoverpass', userController.recoverPassword);
router.post('/resetpass', userController.resetPassword);

router.post('/test', (req, res) => {
	console.log(req.cookies);
	res.json({ reqCookies: req.cookies });
});

router.post('/setcookie', (req, res) => {
	res.cookie('user', 'info', { maxAge: 30 * 24 * 60 * 1000, httpOnly: true }).json('Уставновил куки');
});

router.post('/getApiError', async (req, res, next) => {
	const { login, email, password } = req.body;
	next(ApiError.BadRequest('Пользователь с таким email уже существует'));
});

module.exports = router;
