const bcrypt = require('bcrypt');
const uuid = require('uuid');

const ApiError = require('../exceptions/api-error');

const { User } = require('../models/models');

const mailService = require('./mail-service');
const tokenService = require('./token-service');

class UserService {
	async registration(email, password, login) {
		const candidate = await User.findOne({
			where: { email, isActivated: true },
		});

		if (candidate) {
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} уже существует`
			);
		}

		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuid.v4();

		const user = await User.create({
			email,
			login,
			password: hashPassword,
			activationLink,
		});

		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}user/activate/${activationLink}`
		);

		/* const { accessToken, refreshToken } = tokenService.generateTokens({
			id: user.id,
			email: user.email,
      login: user.login,
			isActivated: user.isActivated,
		});
		await tokenService.saveToken(user.id, refreshToken);

		return {
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				email: user.email,
        login: user.login,
				isActivated: user.isActivated,
			},
		}; */

		return { email };
	}

	async activate(activationLink) {
		const user = await User.findOne({ where: { activationLink } });
		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка активации');
		}
		if (user.isActivated) {
			throw ApiError.BadRequest('Пользователь уже активирован');
		}
		const recoveryLink = uuid.v4();
		user.recoveryLink = recoveryLink;
		user.isActivated = true;
		await user.save();

		User.destroy({
			where: {
				email: user.email,
				isActivated: false,
			},
		});
	}

	async recoverPassword(email) {
		const user = await User.findOne({
			where: {
				email: email,
				isActivated: true,
			},
		});

		if (!user) {
			return next(
				ApiError.BadRequest(
					'Подтвержденный пользователь с таким email не найден'
				)
			);
		}

		if (user.isBlocked) {
			throw ApiError.BadRequest(`Пользователь ${user.login} заблокирован`);
		}

		const recoveryLink = `${process.env.CLIENT_URL}/newpass/${user.recoveryLink}`;
		await mailService.sendRecoveryLink(user.email, recoveryLink);

		return { ok: true };
	}

	async resetPassword(password, recoveryLink) {
		const user = await User.findOne({
			where: {
				recoveryLink,
			},
		});

		if (!user) {
			return next(ApiError.internal('Некорректная ссылка восстановления'));
		}

		const newRecoveryLink = uuid.v4();
		const hashPassword = await bcrypt.hash(password, 3);

		user.password = hashPassword;
		user.recoverнLink = newRecoveryLink;

		await user.save();

		return { ok: true };
	}

	async login(email, password, login) {
		const user = await User.findOne({ where: { login } });

		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким login не найден');
		}

		if (!user.isActivated) {
			throw ApiError.BadRequest('Аккаунт не активирован');
		}

		if (user.isBlocked) {
			throw ApiError.BadRequest(`Пользователь ${user.login} заблокирован`);
		}

		const isPasswordEquals = await bcrypt.compare(password, user.password);
		if (!isPasswordEquals) {
			throw ApiError.BadRequest('Неверный пароль');
		}

		const { accessToken, refreshToken } = tokenService.generateTokens({
			id: user.id,
			email: user.email,
			isActivated: user.isActivated,
			login: user.login,
		});

		await tokenService.saveToken(user.id, refreshToken);

		return {
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				email: user.email,
				isActivated: user.isActivated,
				login: user.login,
			},
		};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}

		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}

		const user = await User.findByPk(userData.id);

		const tokens = tokenService.generateTokens({
			id: user.id,
			email: user.email,
			isActivated: user.isActivated,
			login: user.login,
		});

		await tokenService.saveToken(user.id, tokens.refreshToken);

		return {
			...tokens,
			user: {
				id: user.id,
				email: user.email,
				isActivated: user.isActivated,
				login: user.login,
			},
		};
	}

	async getAllUsers() {
		const users = await User.findAll({
			attributes: ['email', 'role', 'isActivated', 'login'],
		});
		return users;
	}

  async isFreeLogin(login) {
    const user = await User.findOne({
      where: {
        login,
        isActivated: true,
      }
    })

    return !user;
  }
}

module.exports = new UserService();
