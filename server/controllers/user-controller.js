const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
	async registration(req, res, next) {
		try {
			const { email, password, login } = req.body;

			const userData = await userService.registration(
				email.toLowerCase(),
				password,
				login
			);

			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 1000,
				httpOnly: true,
			});
			res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async login(req, res, next) {
		/* AAAAAAAAAAAAAAAAAAAAAAAAAAA ТУТ НЕ ЗАБЫВТЬ ПОМЕНЯТЬ ОБРАТНО НА ТОЕК */
		try {
			const { email, password, login } = req.body;

			const userData = await userService.login(email, password, login);

			console.log({ USERDATA: userData });

			res
				.cookie('refreshToken', userData.refreshToken, {
					/* ТУТ ДЕБАЖУ token */ maxAge: 30 * 24 * 60 * 1000,
					httpOnly: true,
				})
				.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			console.log({ refreshToken });
			const token = await userService.logout(refreshToken);
			res.clearCookie('refreshToken');
			res.clearCookie('user');
			res.status(200).json('Очистили');
		} catch (error) {
			next(error);
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;

			await userService.activate(activationLink);

			res.redirect(`${process.env.CLIENT_URL}/login`);
		} catch (error) {
			next(error);
		}
	}

	async recoverPassword(req, res, next) {
		try {
			const { email } = req.body;

			await userService.recoverPassword(email.toLowerCase());

			res.status(200).json({ email });
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const { password, recoveryLink } = req.body;

			await userService.resetPassword(password, recoveryLink);

			res.status(200).json({ ok: true });
		} catch (error) {
			next(error);
		}
	}

	async refresh(req, res, next) {
		try {
			console.log('IM HERE');
			const { refreshToken } = req.cookies;
			console.log(refreshToken);

			const userData = await userService.refresh(refreshToken);

			console.log({ USERDATA: userData });

			res
				.cookie('refreshToken', userData.refreshToken, {
					maxAge: 30 * 24 * 60 * 1000,
					httpOnly: true,
				})
				.json(userData);
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
