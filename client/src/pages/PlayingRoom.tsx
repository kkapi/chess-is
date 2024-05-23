import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import socket from '@/socket/socket';
import { Link, useParams } from 'react-router-dom';
import { Context } from '@/main';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Chat from '@/components/Chat';
import useWindowDimensions from '@/hooks/useWindowDimensions ';
import GameInfo from '@/components/GameInfo';
import { HOME_ROUTE } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const PlayingRoom = () => {
	const { roomId } = useParams();
	const { store } = useContext(Context);

	const chess = useMemo(() => new Chess(), []);
	const [fen, setFen] = useState(chess.fen());

	const [playerType, setPlayerType] = useState('o');
	const [orientation, setOrientation] = useState('white');
	const [messages, setMessages] = useState([]);

	const [boardSize, setBoardSize] = useState(500);
	const { height, width } = useWindowDimensions();

	const [roomInfo, setRoomInfo] = useState({});
	const [resultMessage, setResultMessage] = useState('');

	const [error, setError] = useState(null);

	const [drawOffer, setDrawOffer] = useState(false);
	const [sendDraw, setSendDraw] = useState(false);

	const [whiteTime, setWhiteTime] = useState(300);
	const [blackTime, setBlackTime] = useState(300);

	const timer = useRef(null);

	function startTimer() {
		if (timer.current) {
			clearInterval(timer.current);
		}
		const callback = chess.turn() === 'w' ? decrementWhiteTimer : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
	}

	function decrementBlackTimer() {
		setBlackTime(prev => prev - 1);
	}

	function decrementWhiteTimer() {
		setWhiteTime(prev => prev - 1);
	}

	function getResultMessage() {
		let mes = '';

		if (chess.isGameOver()) {
			if (chess.isCheckmate()) {
				mes = `Мат! ${chess.turn() === 'w' ? 'Черные' : 'Белые'} победили!`;
			} else if (chess.isDraw()) {
				if (chess.isThreefoldRepetition()) {
					mes = `Ничья! Тройное повторение ходов!`;
				} else if (chess.isInsufficientMaterial()) {
					mes = `Ничья! Недостаточное количество материала`;
				} else if (chess.isStalemate()) {
					mes = `Ничья! Пат!`;
				}
			} else {
				mes = `Игра окончена!`;
			}
		}

		return mes;
	}

	useEffect(() => {
		if (width < 500) {
			setBoardSize(350);
		} else {
			setBoardSize(500);
		}
	}, [width]);

	useEffect(() => {
		if (roomId) {
			console.log(roomId);
			socket.emit(
				'join_room',
				{
					userId: store?.user?.id || store.browserId,
					roomId: roomId,
					login: store.user?.login || 'Аноним',
				},
				response => {
					console.log(response);
					if (response?.err) {
						setError(response?.errMessage);
						console.log(response);
						return;
					}
					chess.loadPgn(response?.data?.room?.pgn);
					setFen(chess.fen());
					setPlayerType(response?.data?.playerType);
					setRoomInfo(response?.data?.room);
					setMessages(response?.data?.room?.messages);

					setWhiteTime(response?.data?.room?.whiteTime);
					setBlackTime(response?.data?.room?.blackTime);

          if (response?.data?.room?.started) {
            startTimer();
          }

					if (response?.data?.playerType === 'b') {
						setOrientation('black');
					}
				}
			);
		}
	}, [roomId, store?.user?.id]);

	const makeAMove = useCallback(
		move => {
			try {
				const result = chess.move(move); // update Chess instance
				setFen(chess.fen()); // update fen state to trigger a re-render

				if (chess.isGameOver()) {
					setResultMessage(getResultMessage());
				}
        startTimer();
				return result;
			} catch (e) {
				return null;
			} // null if the move was illegal, the move object if the move was legal
		},
		[chess]
	);

	// onDrop function
	function onDrop(sourceSquare, targetSquare, piece) {
		if (
			(!roomInfo?.started && (!roomInfo?.white || !roomInfo?.black)) ||
			roomInfo?.ended
		)
			return false;
		if (playerType !== chess.turn()) return false;
		const moveData = {
			from: sourceSquare,
			to: targetSquare,
			color: chess.turn(),
			promotion: piece[1].toLowerCase() ?? 'q',
		};

		const move = makeAMove(moveData);
		// illegal move
		if (move === null) return false;

		socket.emit('move', {
			move,
			roomId,
			pgn: chess.pgn(),
			ended: chess.isGameOver(),
			resultMessage: getResultMessage(),
		});

		setRoomInfo(prev => {
			const newRoomInfo = {
				...prev,
				pgn: chess.pgn(),
				ended: chess.isGameOver(),
				resultMessage: getResultMessage(),
			};

			if (!prev?.started) {
				newRoomInfo.started = true;
			}

			return newRoomInfo;
		});

		return true;
	}

	useEffect(() => {
		socket.on('move', data => {
			const { move, room } = data;
			makeAMove(move);
			setRoomInfo(room);
		});
	}, [makeAMove]);

	useEffect(() => {
		socket.on('updateRommInfo', room => {
			setRoomInfo(room);
			setSendDraw(false);
		});

		socket.on('declineDraw', data => {
			setDrawOffer(false);
			setSendDraw(false);
		});
	}, []);

	useEffect(() => {
		socket.on('drawOffer', data => {
			const { userId, playerType: type } = data;
			console.log(data);
			console.log(playerType);

			if (playerType === 'w' || playerType === 'b') {
				setDrawOffer(true);
			}
		});
	}, [playerType]);

	useEffect(() => {
		return () => {
			socket.emit('leaveRoom', {
				roomId,
				userId: store?.user?.id || store?.browserId,
			});
		};
	}, []);

	if (error) {
		return (
			<DefaultLayout>
				<section className="flex items-center h-[84vh] md:h-[79vh] p-16 bg-background">
					<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
						<div className="max-w-md text-center">
							<h2 className="mb-8 font-extrabold text-5xl text-foreground">
								Ошибка
							</h2>
							<p className="text-2xl font-semibold md:text-3xl">{error}</p>
							<p className="mt-4 mb-8 text-muted-foreground">
								Не переживайте, вы можете найти множество других вещей на нашей
								главной странице.
							</p>
							<Link
								to={HOME_ROUTE}
								className="px-8 py-3 font-semibold rounded text-foreground"
							>
								Вернуться на главную
							</Link>
						</div>
					</div>
				</section>
			</DefaultLayout>
		);
	}

	return (
		<DefaultLayout>
			<div className="container relative">
				<div className="min-h-[100vh] md:min-h-[79vh] flex flex-col md:flex-row gap-8 justify-start md:justify-center items-center">
					<div>
						{whiteTime} {blackTime}
					</div>
					<div className="hidden md:block">
						<GameInfo
							roomInfo={roomInfo}
							orientation={orientation}
							setOrientation={setOrientation}
							playerType={playerType}
							resultMessage={resultMessage}
							setRoomInfo={setRoomInfo}
							sendDraw={sendDraw}
							setSendDraw={setSendDraw}
							drawOffer={drawOffer}
							setDrawOffer={setDrawOffer}
						/>
					</div>

					<div className={`w-[${boardSize}px] h-[${boardSize}px mt-9 md:mt-0`}>
						<Chessboard
							arePiecesDraggable={playerType === 'w' || playerType === 'b'}
							promotionDialogVariant="vertical"
							arePremovesAllowed={false}
							boardWidth={boardSize}
							position={fen}
							onPieceDrop={onDrop}
							boardOrientation={orientation}
						/>
					</div>
					<div className="block md:hidden">
						<GameInfo
							roomInfo={roomInfo}
							orientation={orientation}
							playerType={playerType}
							setOrientation={setOrientation}
							resultMessage={resultMessage}
							setRoomInfo={setRoomInfo}
							sendDraw={sendDraw}
							setSendDraw={setSendDraw}
							drawOffer={drawOffer}
							setDrawOffer={setDrawOffer}
						/>
					</div>
					{(playerType === 'w' || playerType === 'b') && (
						<Chat
							roomId={roomId}
							messages={messages}
							setMessages={setMessages}
							color={playerType}
							login={store.user?.login || 'Аноним'}
						/>
					)}
				</div>
			</div>
		</DefaultLayout>
	);
};

export default observer(PlayingRoom);
