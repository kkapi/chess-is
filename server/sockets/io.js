const { v4: uuidv4 } = require('uuid');

const users = new Map();
const rooms = new Map();

module.exports = io => {
	io.on('connection', socket => {
		console.log('New socket aaaa');

		socket.on('print_rooms', () => {
			console.log(rooms);
		});

		socket.on('create_room', async (data, callBack) => {
			const { userId, login } = data;
			const roomId = uuidv4();

			const newRoom = {
				id: roomId,
				white: {
					userId,
					login,
				},
				black: null,
				started: false,
				pgn: '',
				time: 50000,
				whiteConnected: false,
				blackConnected: false,
				countConnectedWhite: 0,
				countConnectedBlack: 0,
				messages: [],
				private: false,
			};

			rooms.set(roomId, newRoom);

			const response = {
				err: false,
				errMessage: '',
				data: {
					room: newRoom,
				},
			};

			callBack(response);
		});

		socket.on('join_room', async (data, callBack) => {
			const { userId, roomId, login } = data;
			console.log(data);
			if (!socket.chessInfo) {
				socket.chessInfo = {};
				socket.chessInfo.id = userId;
				socket.chessInfo.rooms = new Set();
			}

			const room = rooms.get(roomId);

			if (!room) {
				const response = {
					err: true,
					errMessage: 'Комнаты не сущесвует',
				};

				callBack(response);
				return;
			}

			await socket.join(roomId);
			socket.chessInfo.rooms.add(roomId);

			if (!room.white && userId !== room.black?.userId) {
				room.white = {
					userId,
					login,
				};
			}

			if (!room.black && userId !== room.white?.userId) {
				room.black = {
					userId,
					login,
				};
			}

			let playerType = 'o';

			if (userId === room.white?.userId) {
				room.whiteConnected = true;
				room.countConnectedWhite += 1;
				playerType = 'w';
			}

			if (userId === room.black?.userId) {
				room.blackConnected = true;
				room.countConnectedBlack += 1;
				playerType = 'b';
			}

			if (room.white && room.black && !room.started) {
				room.started = true;
			}

			const response = {
				err: false,
				errMessage: '',
				data: {
					playerType: playerType,
					room: room,
				},
			};

			socket.to(roomId).emit('updateRommInfo', room);

			callBack(response);
		});

		socket.on('move', data => {
			const { move, roomId, pgn } = data;
			const room = rooms.get(roomId);
			room.pgn = pgn;

			socket.to(roomId).emit('move', { move, room });
		});

		socket.on('message', data => {
			const { message, login, roomId, color, time } = data;
			const room = rooms.get(roomId);
			const newMes = { message, login, time, color };
			room.messages.push(newMes);

			socket.to(roomId).emit('message', newMes);
		});

		socket.on('disconnecting', reason => {
			if (socket.chessInfo?.rooms) {
				for (let roomId of socket.chessInfo.rooms) {
					const room = rooms.get(roomId);
					if (!room) continue;

					if (socket?.chessInfo?.id === room?.white?.userId) {
						room.countConnectedWhite -= 1;
						if (room.countConnectedWhite === 0) {
							room.whiteConnected = false;
						}
					}

					if (socket?.chessInfo?.id === room?.black?.userId) {
						room.countConnectedBlack -= 1;
						if (room.countConnectedBlack === 0) {
							room.blackConnected = false;
						}
					}

					socket.to(roomId).emit('updateRommInfo', room);
				}
			}
		});
	});
};
