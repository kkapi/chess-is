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
				ended: false,
				resultMessage: '',
				pgn: '',
				time: 50000,
				whiteConnected: false,
				blackConnected: false,
				countConnectedWhite: 0,
				countConnectedBlack: 0,
				messages: [],
				private: true,
			};

			rooms.set(roomId, newRoom);

			await socket.join(roomId);

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
			const { userId, roomId, login, role } = data;
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
					errMessage: 'Активной комнаты с таким адресом не сущесвует!',
				};

				callBack(response);
				return;
			}

			if (
				room?.private &&
				role !== 'ADMIN' &&
				room.white &&
				room.black &&
				userId !== room?.white?.userId &&
				userId !== room?.black?.userId
			) {
				const response = {
					err: true,
					errMessage:
						'Это приватная комната, к сожалению, вы не можете присоединиться к просмотру!',
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

				socket.to(roomId).emit('opponent', { roomId });
			}

			if (!room.black && userId !== room.white?.userId) {
				room.black = {
					userId,
					login,
				};
				socket.to(roomId).emit('opponent', { roomId });
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
			const { move, roomId, pgn, ended, resultMessage } = data;
			const room = rooms.get(roomId);

			if (room.white && room.black && !room.started) {
				room.started = true;
			}

			room.pgn = pgn;
			room.ended = ended;
			room.resultMessage = resultMessage;

			socket.to(roomId).emit('move', { move, room });
		});

		socket.on('message', data => {
			const { message, login, roomId, color, time } = data;
			const room = rooms.get(roomId);
			const newMes = { message, login, time, color };
			room.messages.push(newMes);

			socket.to(roomId).emit('message', newMes);
		});

		socket.on('leaveRoom', async data => {
			console.log('LEAVE ROOM');
			const { roomId, userId } = data;
			const room = rooms.get(roomId);
			if (!room) return;

			if (userId === room?.white?.userId) {
				room.countConnectedWhite -= 1;
				if (room.countConnectedWhite === 0) {
					room.whiteConnected = false;
				}
			}

			if (userId === room?.black?.userId) {
				room.countConnectedBlack -= 1;
				if (room.countConnectedBlack === 0) {
					room.blackConnected = false;
				}
			}

			socket.to(roomId).emit('updateRommInfo', room);

			if (
				room.ended &&
				room.countConnectedWhite <= 0 &&
				room.countConnectedBlack <= 0
			) {
				const clientSockets = await io.in(roomId).fetchSockets();

				clientSockets.forEach(s => {
					s.leave(roomId);
				});

				rooms.delete(roomId);
			}
		});

		socket.on('resign', data => {
			const { roomId, userId } = data;
			const room = rooms.get(roomId);

			if (
				!room ||
				(userId !== room?.white?.userId && userId !== room?.black?.userId)
			) {
				return;
			}

			room.ended = true;
			if (userId === room?.white?.userId) {
				room.resultMessage = 'Белые сдались, победа черных!';
			} else {
				room.resultMessage = 'Черные сдались, победа белых!';
			}

			socket.to(roomId).emit('updateRommInfo', room);
		});

		socket.on('disconnecting', async reason => {
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

					if (
						room.ended &&
						room.countConnectedWhite <= 0 &&
						room.countConnectedBlack <= 0
					) {
						const clientSockets = await io.in(roomId).fetchSockets();

						clientSockets.forEach(s => {
							s.leave(roomId);
						});

						rooms.delete(roomId);
					}
				}
			}
		});
	});
};
