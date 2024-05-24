const { v4: uuidv4 } = require('uuid');
const gameService = require('../services/game-service');

const authorizedQueue = new Map();
const unauthorizedQueue = new Map();

const rooms = new Map();

module.exports = io => {
	io.on('connection', socket => {
		console.log('Новое подключение');

		socket.on('print_rooms', () => {
			console.log(rooms);
		});

    socket.on('cancelFind', () => {
      authorizedQueue.delete(socket);
      unauthorizedQueue.delete(socket);
    })

		socket.on('findGame', async data => {
			try {
				const { userId, login, time, increment } = data;
				if (!isNaN(userId)) {
					// Зарегистрированный
					for (let [opponent, info] of authorizedQueue.entries()) {
						const {
							userId: opponentId,
							login: opponentLogin,
							time: opponentTime,
							increment: opponentIncrement,
						} = info;

						if (
							userId !== opponentId &&
							time === opponentTime &&
							increment === opponentIncrement
						) {
							console.log('Нашлась игра');
							const roomId = uuidv4();

							const newRoom = {
								id: roomId,
								variant: 'Стандарт',
								type: 'QUEUE',
								private: false,

								white: null,
								black: null,

								started: false,
								ended: false,

								turn: 'white',

								resultMessage: '',

								pgn: '',

								timeControl: true,
								whiteTime: time * 60,
								blackTime: time * 60,
								increment: increment,
								updatedAt: Date.now(),

								whiteConnected: false,
								blackConnected: false,

								countConnectedWhite: 0,
								countConnectedBlack: 0,

								messages: [],
							};

							if (Math.random() > 0.5) {
								newRoom.white = {
									userId: userId,
									login: login,
								};
								newRoom.black = {
									userId: opponentId,
									login: opponentLogin,
								};
							} else {
								newRoom.white = {
									userId: opponentId,
									login: opponentLogin,
								};
								newRoom.black = {
									userId: userId,
									login: login,
								};
							}

							rooms.set(roomId, newRoom);

              authorizedQueue.delete(opponent);

							socket.emit('foundGame', { roomId });
							opponent.emit('foundGame', { roomId });

							return;
						}
					}
					authorizedQueue.set(socket, { userId, login, time, increment });
				} else {
					// Незарегистрированный
          for (let [opponent, info] of unauthorizedQueue.entries()) {
						const {
							userId: opponentId,
							login: opponentLogin,
							time: opponentTime,
							increment: opponentIncrement,
						} = info;

						if (
							userId !== opponentId &&
							time === opponentTime &&
							increment === opponentIncrement
						) {
							console.log('Нашлась игра');
							const roomId = uuidv4();

							const newRoom = {
								id: roomId,
								variant: 'Стандарт',
								type: 'QUEUE',
								private: false,

								white: null,
								black: null,

								started: false,
								ended: false,

								turn: 'white',

								resultMessage: '',

								pgn: '',

								timeControl: true,
								whiteTime: time * 60,
								blackTime: time * 60,
								increment: increment,
								updatedAt: Date.now(),

								whiteConnected: false,
								blackConnected: false,

								countConnectedWhite: 0,
								countConnectedBlack: 0,

								messages: [],
							};

							if (Math.random() > 0.5) {
								newRoom.white = {
									userId: userId,
									login: login,
								};
								newRoom.black = {
									userId: opponentId,
									login: opponentLogin,
								};
							} else {
								newRoom.white = {
									userId: opponentId,
									login: opponentLogin,
								};
								newRoom.black = {
									userId: userId,
									login: login,
								};
							}

							rooms.set(roomId, newRoom);

              unauthorizedQueue.delete(opponent);

							socket.emit('foundGame', { roomId });
							opponent.emit('foundGame', { roomId });

							return;
						}
					}
					unauthorizedQueue.set(socket, { userId, login, time, increment });
				}
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('create_room', async (data, callBack) => {
			try {
				const {
					userId,
					login,
					color,
					variant,
					timeControl,
					private,
					time,
					increment,
				} = data;

				const roomId = uuidv4();

				const newRoom = {
					id: roomId,
					variant: variant,
					type: 'PERSONAL_ROOM',
					private: private,

					white: null,
					black: null,

					started: false,
					ended: false,

					turn: 'white',

					resultMessage: '',

					pgn: '',

					timeControl: timeControl,
					whiteTime: time * 60,
					blackTime: time * 60,
					increment: increment,
					updatedAt: Date.now(),

					whiteConnected: false,
					blackConnected: false,

					countConnectedWhite: 0,
					countConnectedBlack: 0,

					messages: [],
				};

				if (color === 'Белые') {
					newRoom.white = {
						userId: userId,
						login: login,
					};
				} else if (color === 'Черные') {
					newRoom.black = {
						userId: userId,
						login: login,
					};
				} else {
					if (Math.random() > 0.5) {
						newRoom.white = {
							userId: userId,
							login: login,
						};
					} else {
						newRoom.black = {
							userId: userId,
							login: login,
						};
					}
				}

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
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('cancelRoom', data => {
			try {
				let { roomId } = data;
				roomId = roomId?.split('/')[2];
				console.log(rooms.get(roomId));
				rooms.delete(roomId);
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('join_room', async (data, callBack) => {
			try {
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

        // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????
				if (room.started && !room.ended) {
					if (room.turn === 'white') {
						room.whiteTime = Math.floor(
							room.whiteTime - ((Date.now() - room.updatedAt) / 1000)
						);
					} else {
						room.blackTime = Math.floor(
							room.blackTime - ((Date.now() - room.updatedAt) / 1000)
						);
					}
					room.updatedAt = Date.now();
				}
        // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????

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
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('move', async data => {
			try {
				const {
					move,
					roomId,
					pgn,
					ended,
					resultMessage,
					whiteTime,
					blackTime,
				} = data;
				const room = rooms.get(roomId);

				if (room.white && room.black && !room.started) {
					room.started = true;
				}

				room.turn = room.turn === 'white' ? 'black' : 'white';

				room.pgn = pgn;

				if (!room.ended && ended) {
					room.ended = ended;
					room.resultMessage = resultMessage;

					await gameService.createGame(
						room?.id,
						room?.white?.userId,
						room?.black?.userId,
						room?.resultMessage,
						JSON.stringify(room.messages),
						room.pgn,
						room.time,
						room.type
					);
				}

				room.updatedAt = Date.now();

				room.whiteTime = whiteTime;
				room.blackTime = blackTime;

				socket.to(roomId).emit('move', { move, room });
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('timeOver', async data => {
			try {
				const { roomId, userId, color } = data;
				console.log('TIMEOVER', { roomId, color });
				const room = rooms.get(roomId);

				if (
					!room ||
					room.ended ||
					(userId !== room?.white?.userId && userId !== room?.black?.userId)
				) {
					return;
				}

				room.ended = true;
				if (color === 'w') {
					room.whiteTime = 0;
					room.resultMessage = 'Белые просрочили время, победа черных!';
				} else {
					room.blackTime = 0;
					room.resultMessage = 'Черные просрочили время, победа белых!';
				}

				io.to(roomId).emit('updateRommInfo', room);

				await gameService.createGame(
					room?.id,
					room?.white?.userId,
					room?.black?.userId,
					room?.resultMessage,
					JSON.stringify(room.messages),
					room.pgn,
					room.time,
					room.type
				);
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('message', data => {
			try {
				const { message, login, roomId, color, time } = data;
				const room = rooms.get(roomId);
				const newMes = { message, login, time, color };
				room.messages.push(newMes);

				socket.to(roomId).emit('message', newMes);
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('leaveRoom', async data => {
			try {
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

        // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????
        if (room.started && !room.ended) {
					if (room.turn === 'white') {
						room.whiteTime = Math.floor(
							room.whiteTime - ((Date.now() - room.updatedAt) / 1000)
						);
					} else {
						room.blackTime = Math.floor(
							room.blackTime - ((Date.now() - room.updatedAt) / 1000)
						);
					}
					room.updatedAt = Date.now();
				}
        // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????

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
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('resign', async data => {
			try {
				const { roomId, userId, blackTime, whiteTime } = data;
				const room = rooms.get(roomId);

				if (
					!room ||
					(userId !== room?.white?.userId && userId !== room?.black?.userId)
				) {
					return;
				}

				room.ended = true;
				room.blackTime = blackTime;
				room.whiteTime = whiteTime;
				if (userId === room?.white?.userId) {
					room.resultMessage = 'Белые сдались, победа черных!';
				} else {
					room.resultMessage = 'Черные сдались, победа белых!';
				}

				socket.to(roomId).emit('updateRommInfo', room);

				await gameService.createGame(
					room?.id,
					room?.white?.userId,
					room?.black?.userId,
					room?.resultMessage,
					JSON.stringify(room.messages),
					room.pgn,
					room.time,
					room.type
				);
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('drawOffer', data => {
			try {
				const { roomId, userId, playerType, login } = data;
				console.log('DRAW OFFER');
				const room = rooms.get(roomId);
				if (
					!room ||
					(userId !== room?.white?.userId && userId !== room?.black?.userId)
				) {
					return;
				}

				const message = 'Отправлено предложение о ничье';
				const newMes = { message, time: Date.now(), type: 'info', login };
				room.messages.push(newMes);

				io.to(roomId).emit('message', newMes);

				socket.to(roomId).emit('drawOffer', { userId, playerType });
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('confirmDraw', async data => {
			try {
				const { roomId, userId, whiteTime, blackTime } = data;

				const room = rooms.get(roomId);

				if (
					!room ||
					(userId !== room?.white?.userId && userId !== room?.black?.userId)
				) {
					return;
				}

				room.ended = true;
				room.whiteTime = whiteTime;
				room.blackTime = blackTime;
				room.resultMessage = 'Ничья! Соперники согласились на ничью.';

				io.to(roomId).emit('updateRommInfo', room);

				await gameService.createGame(
					room?.id,
					room?.white?.userId,
					room?.black?.userId,
					room?.resultMessage,
					JSON.stringify(room.messages),
					room.pgn,
					room.time,
					room.type
				);
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('declineDraw', data => {
			try {
				const { roomId, userId, login } = data;

				const room = rooms.get(roomId);

				if (
					!room ||
					(userId !== room?.white?.userId && userId !== room?.black?.userId)
				) {
					return;
				}

				const message = 'Предложение отклонено';
				const newMes = { message, time: Date.now(), type: 'info', login };
				room.messages.push(newMes);

				io.to(roomId).emit('message', newMes);

				io.to(roomId).emit('declineDraw', { userId });
			} catch (e) {
				console.log(e);
			}
		});

		socket.on('disconnecting', async reason => {
			try {
        authorizedQueue.delete(socket);
        unauthorizedQueue.delete(socket);

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
            
            // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????
            if (room.started && !room.ended) {
              if (room.turn === 'white') {
                room.whiteTime = Math.floor(
                  room.whiteTime - ((Date.now() - room.updatedAt) / 1000)
                );
              } else {
                room.blackTime = Math.floor(
                  room.blackTime - ((Date.now() - room.updatedAt) / 1000)
                );
              }
              room.updatedAt = Date.now();
            }
            // ВРЕМЯ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
			} catch (e) {
				console.log(e);
			}
		});
	});
};
