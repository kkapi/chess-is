const { Game } = require('../models/models');

class GameService {
	async createGame(uuid, white, black, resultMessage, messages, pgn, time, type) {
		white = !isNaN(white) ? white : null;
		black = !isNaN(black) ? black : null;

		console.log({ uuid, white, black, resultMessage, messages, pgn, time, type });

		const game = await Game.create({
			uuid,
			white,
			black,
      resultMessage,
			messages,
			pgn,
			time,
			type,
		});

		return uuid;
	}
}

module.exports = new GameService();
