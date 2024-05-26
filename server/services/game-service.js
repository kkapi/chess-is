const { Game, Complaint } = require('../models/models');

class GameService {
	async createGame(
		uuid,
		white,
		black,
		resultMessage,
		messages,
		pgn,
		time,
		type
	) {
		white = !isNaN(white) ? white : null;
		black = !isNaN(black) ? black : null;

		await Complaint.update(
			{ isGameEnded: true },
			{
				where: {
					gameUuid: uuid,
				},
			}
		);

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
