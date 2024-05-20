const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
			}

			const { email, password, login } = req.body;

			const userData = await userService.registration(email, password, login);

			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password, login } = req.body;

			const userData = await userService.login(email, password, login);

			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 1000,
				httpOnly: true,
			});

			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await userService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.status(200).json({ token });
		} catch (error) {
			next(error);
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;

			await userService.activate(activationLink);

			return res.redirect(process.env.CLIENT_URL);
		} catch (error) {
			next(error);
		}
	}

	async recoverPassword(req, res, next) {
		try {
			const { email } = req.body;
			await userService.recoverPassword(email);

			res.status(200).json({ ok: true });
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const { password, recoveryLink } = req.body;

			await userService.resetPassword(password, recoveryLink);

			res.status(200);
		} catch (error) {
			next(error);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;

			const userData = await userService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 1000,
				httpOnly: true,
			});

			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async getUsers(req, res, next) {
		try {
			const users = await userService.getAllUsers();
			res.json(users);
		} catch (error) {
			next(error);
		}
	}

	async isFreeLogin(req, res, next) {
		try {
			const { login } = req.query;
			const isLoginFree = await userService.isFreeLogin(login);

			res.json({ isLoginFree });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
