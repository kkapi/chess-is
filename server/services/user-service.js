const bcrypt = require('bcrypt');
const uuid = require('uuid');

const ApiError = require('../exceptions/api-error');

const { User, UserInfo, Game } = require('../models/models');
const { Op } = require('sequelize');

const mailService = require('./mail-service');
const tokenService = require('./token-service');

class UserService {
	async registration(email, password, login) {
		const existLogin = await User.findOne({
			where: { login },
		});

		if (existLogin) {
			throw ApiError.BadRequest(`Данный логин занят`);
		}

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

		user.isActivated = true;
		await user.save();

		const userInfo = await UserInfo.create({ userId: user.id });

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
			throw ApiError.BadRequest(
				'Подтвержденный пользователь с таким email не найден'
			);
		}

		if (user.isBlocked) {
			throw ApiError.BadRequest(`Пользователь ${user.login} заблокирован`);
		}

		const recoveryLink = uuid.v4();
		user.recoveryLink = recoveryLink;
		await user.save();

		const sendRecoveryLink = `${process.env.CLIENT_URL}/newpass/${user.recoveryLink}`;
		await mailService.sendRecoveryLink(
			user.email,
			sendRecoveryLink,
			user.login
		);

		return { ok: true };
	}

	async resetPassword(password, recoveryLink) {
		const user = await User.findOne({
			where: {
				recoveryLink,
				isActivated: true,
			},
		});

		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка восстановления');
		}

		const newRecoveryLink = uuid.v4();
		const hashPassword = await bcrypt.hash(password, 3);

		user.password = hashPassword;
		user.recoveryLink = newRecoveryLink;

		await user.save();

		return { ok: true };
	}

	async login(email, password, login) {
		const user = await User.findOne({ where: { login } });

		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким логином не найден');
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
			role: user.role,
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
				role: user.role,
				isChatBlocked: user.isChatBlocked,
				isPrivate: user.isPrivate,
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
			role: user.role,
		});

		await tokenService.saveToken(user.id, tokens.refreshToken);

		return {
			...tokens,
			user: {
				id: user.id,
				email: user.email,
				isActivated: user.isActivated,
				login: user.login,
				role: user.role,
				isChatBlocked: user.isChatBlocked,
				isPrivate: user.isPrivate,
			},
		};
	}

	async getAllUsers() {
		const users = await User.findAll({
			where: {
				isActivated: true,
			},
			attributes: [
				'id',
				'email',
				'role',
				'isBlocked',
				'isChatBlocked',
				'isPrivate',
				'login',
				'createdAt',
			],
      order: [['id', 'ASC']],
		});
		return users;
	}

	async isFreeLogin(login) {
		const user = await User.findOne({
			where: {
				login,
				isActivated: true,
			},
		});

		return !user;
	}

	async getUserInfo(id) {
		const user = await User.findOne({
			where: { id },
			include: UserInfo,
		});

		console.log(user);

		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким id ненайден');
		}

		return {
			id: user.id,
			email: user.email,
			login: user.login,
			role: user.role,
			isBlocked: user.isBlocked,
			isChatBlocked: user.isChatBlocked,
			isPrivate: user.isPrivate,
			info: user.info,
		};
	}

	async chageUserInfo(
		userId,
		name,
		surname,
		about,
		rating,
		isBlocked,
		isChatBlocked,
		isPrivate,
		role
	) {
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким id ненайден');
		}
		const userInfo = await UserInfo.findOne({ where: { userId } });
		user.isBlocked = isBlocked;
		user.isChatBlocked = isChatBlocked;
		user.isPrivate = isPrivate;
		user.role = role;
		await user.save();

		userInfo.name = name;
		userInfo.surname = surname;
		userInfo.about = about;
		userInfo.rating = rating;
		await userInfo.save();

		return {
			id: user.id,
			email: user.email,
			login: user.login,
			role: user.role,
			isBlocked: user.isBlocked,
			isChatBlocked: user.isChatBlocked,
			isPrivate: user.isPrivate,
			info: userInfo,
		};
	}

	async changePassword(userId, password, newPassword) {
		const user = await User.findOne({ where: { id: userId } });

		const isPasswordEquals = await bcrypt.compare(password, user.password);
		if (!isPasswordEquals) {
			throw ApiError.BadRequest('Неверный пароль');
		}

		const hashPassword = await bcrypt.hash(newPassword, 3);
		user.password = hashPassword;
		await user.save();

		return 'ok';
	}

	async getUserGame(userId) {
		const games = await Game.findAll({
			where: {
				[Op.or]: [{ white: userId }, { black: userId }],
			},
			order: [['createdAt', 'DESC']],
		});

		return games;
	}

	async getGameInfo(gameUuid) {
		const game = await Game.findOne({
			where: {
				uuid: gameUuid,
			},
			include: [
				{
					model: User,
					as: 'whitePlayer',
					attributes: ['id', 'login', 'email'],
				},
				{
					model: User,
					as: 'blackPlayer',
					attributes: ['id', 'login', 'email'],
				},
			],
		});

		if (!game) {
			throw ApiError.BadRequest('Игры с таким id не существует');
		}

		return game;
	}

	async banUser(userId) {
		const user = await User.findOne({
			where: {
				id: userId,
			},
		});

    if (!user) {
      throw ApiError.BadRequest('Нет пользователя с таким id');
    }

    user.isBlocked = true;
    await user.save();

    return user.id;
	}

  async banChat(userId) {
    const user = await User.findOne({
			where: {
				id: userId,
			},
		});

    if (!user) {
      throw ApiError.BadRequest('Нет пользователя с таким id');
    }

    user.isChatBlocked = true;
    await user.save();

    return user.id;
  }
}

module.exports = new UserService();
