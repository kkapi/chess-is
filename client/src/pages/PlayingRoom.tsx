import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import socket from '@/socket/socket';
import { useParams } from 'react-router-dom';
import { Context } from '@/main';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Chat from '@/components/Chat';
import useWindowDimensions from '@/hooks/useWindowDimensions ';
import GameInfo from '@/components/GameInfo';

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
					if (response?.err) return;
					chess.loadPgn(response?.data?.room?.pgn);
					setFen(chess.fen());
					setPlayerType(response?.data?.playerType);
					setRoomInfo(response?.data?.room);
					setMessages(response?.data?.room?.messages);
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

				if (chess.isGameOver()) return null;

				return result;
			} catch (e) {
				return null;
			} // null if the move was illegal, the move object if the move was legal
		},
		[chess]
	);

	// onDrop function
	function onDrop(sourceSquare, targetSquare, piece) {
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
		});

		setRoomInfo(prev => {
			return {
				...prev,
				pgn: chess.pgn(),
			};
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
		});
	}, []);

	return (
		<DefaultLayout>
			<div className="container relative">
				<div className="min-h-[100vh] md:min-h-[79vh] flex flex-col md:flex-row gap-8 justify-start md:justify-center items-center">
					<div className="hidden md:block">
						<GameInfo
							roomInfo={roomInfo}
							orientation={orientation}
							setOrientation={setOrientation}
              playerType={playerType}
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
