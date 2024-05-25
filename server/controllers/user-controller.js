const userService = require('../services/user-service');

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
		try {
			const { email, password, login } = req.body;

			const userData = await userService.login(email, password, login);

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

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			console.log({ refreshToken });
			const token = await userService.logout(refreshToken);
			res.clearCookie('refreshToken');
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
			const { refreshToken } = req.cookies;

			const userData = await userService.refresh(refreshToken);

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

  async getUserInfo(req, res, next) {
    try {
      const userId = req.params.id;

			const user = await userService.getUserInfo(userId);

			res.json({ user });
		} catch (error) {
			next(error);
		}
  }

  async chageUserInfo(req, res, next) {
    try {
      const {userId, name, surname, about, rating, isBlocked, isChatBlocked, isPrivate, role} = req.body;

      const data = await userService.chageUserInfo(userId, name, surname, about, rating, isBlocked, isChatBlocked, isPrivate, role);

      res.json(data);
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req, res, next) {
    try {
      const {userId, password, newPassword} = req.body;
      await userService.changePassword(userId, password, newPassword);
      
      res.json('ok')
    } catch (error) {
      next(error)
    }
  }

  async getUserGames(req, res, next) {
    try {
      const userId = req.params.id;
      const games = await userService.getUserGame(userId);

      res.json(games);
    } catch (error) {
      next(error)
    }
  }

  async getGameInfo(req, res, next) {
    try {
      const gameUuid = req.params.uuid;
      const game = await userService.getGameInfo(gameUuid);

      res.json(game);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController();