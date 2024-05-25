import { Button } from '@/components/ui/button';
import useCastomPieces from '@/hooks/useCastomPieces';
import useWindowDimensions from '@/hooks/useWindowDimensions ';
import { $api } from '@/http';
import DefaultLayout from '@/layouts/DefaultLayout';
import { ANALYSIS_GAME_ROUT } from '@/lib/constants';
import { Chess } from 'chess.js';
import {
	Repeat2,
	Clipboard,
	RotateCcw,
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
	Undo2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Link, useNavigate, useParams } from 'react-router-dom';

function formatDateTime(isoString) {
	const date = new Date(isoString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	};

	return date.toLocaleString('ru-RU', options);
}

const FinishedGamePage = () => {
	const game = useMemo(() => new Chess(), []);
	const { uuid } = useParams();

  const navigate = useNavigate();

	const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());

	const [boardSize, setBoardSize] = useState(500);
	const { height, width } = useWindowDimensions();

	const [pgn, setPgn] = useState([]);
	const [seletedMove, setSelectedMove] = useState(0);

	const [orientation, setOrientation] = useState('white');

	const [gameInfo, setGameInfo] = useState({});

	function splitPGN(pgnNotation) {
		// Разбиваем строку на отдельные ходы, используя пробел как разделитель
		let moves = pgnNotation.split(' ');

		// Удаляем номера ходов (цифры с точкой) из массива
		moves = moves.filter(move => isNaN(parseInt(move)));

		return moves;
	}

	useEffect(() => {
		if (uuid) {
			async function fetchGameData() {
				const response = await $api.get(`/user/game/${uuid}`);
				console.log(response.data);
				setGameInfo(response.data);
				setPgn(splitPGN(response.data.pgn));
				game.loadPgn(response.data.pgn);
				setChessBoardPosition(game.fen());
				const messages = JSON.parse(response.data.messages);
				console.log(messages);
			}

			fetchGameData();
		}
	}, [uuid]);

	useEffect(() => {
		if (width < 500) {
			setBoardSize(350);
		} else {
			setBoardSize(500);
		}
	}, [width]);

	function onDrop(sourceSquare, targetSquare, piece) {
		const move = game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: piece[1].toLowerCase() ?? 'q',
		});
		setChessBoardPosition(game.fen());

		// illegal move
		if (move === null) return false;

		if (game.isGameOver() || game.isDraw()) {
			return false;
		}

		return true;
	}

	const {
		customBoardStyle,
		customDarkSquareStyle,
		customLightSquareStyle,
		customPieces,
	} = useCastomPieces();

	useEffect(() => {
		game.loadPgn(pgn.slice(0, seletedMove + 1).join(' '));
		setChessBoardPosition(game.fen());
	}, [seletedMove]);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex justify-center items-center min-h-[80vh]">
					<div className="flex flex-col md:flex-row justify-center items-center md:gap-12 mt-6 md:mt-0">
						<div className="border rounded-md  w-[400px] md:w-[500px] min-h-[200px] p-8 flex flex-col justify-center items-center gap-2">
							<div className="font-bold  text-xl md:text-4xl">
								<span>Завершенная партия</span>
							</div>
              <div className='text-base font-semibold'>{gameInfo?.resultMessage}</div>
              <div className='text-base font-semibold'>{formatDateTime(gameInfo?.createdAt)}</div>
							<div className="text-lg">
								Черные фигруры:{' '}
								{gameInfo?.whitePlayer ? (
									<span className="font-bold cursor-pointer hover:underline">
										{gameInfo?.whitePlayer?.login}
									</span>
								) : (
									<span>Аноним</span>
								)}
							</div>
							<div className="text-lg">
								Черные фигруры:{' '}
								{gameInfo?.blackPlayer ? (
									<span className="font-bold cursor-pointer hover:underline" onClick={() => {
                    navigate(`/profile/${gameInfo?.blackPlayer?.id}`)
                  }}>
										{gameInfo?.blackPlayer?.login}
									</span>
								) : (
									<span>Аноним</span>
								)}
							</div>

							<div className="flex flex-col">
								<div className="flex gap-4">
									<div className="w-[300px] border h-[130px] rounded-lg p-3 overflow-y-auto text-base">
										{game.pgn() ? (
											<>{game.pgn()}</>
										) : (
											<div className="h-full flex justify-center items-center text-muted-foreground">
												Ожидание начала игры
											</div>
										)}
									</div>

									<div className="flex flex-col justify-center items-center gap-4">
										<Button
											variant="outline"
											onClick={() => {
												setOrientation(prev =>
													prev === 'white' ? 'black' : 'white'
												);
											}}
										>
											<Repeat2 className="h-5 w-5" />
										</Button>
										<Button
											variant="outline"
											onClick={() => {
												navigator.clipboard.writeText(game.pgn());
											}}
										>
											<Clipboard className="h-5 w-5" />
										</Button>
									</div>
								</div>
								<div className="flex justify-center items-center gap-4 mt-4">
									<Button
										onClick={() => {
											game.reset();
											setChessBoardPosition(game.fen());
										}}
										className="flex justify-center items-center gap-2"
										variant="outline"
										disabled={!game.pgn()}
									>
										Очистить доску
										<RotateCcw />
									</Button>

									<div className="text-center text-sm">
										<Link to={ANALYSIS_GAME_ROUT} className="underline">
											Анализ партии
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div
							className={`w-[${boardSize}px] h-[${boardSize}px mt-9 md:mt-0`}
						>
							<Chessboard
								customBoardStyle={customBoardStyle}
								customDarkSquareStyle={customDarkSquareStyle}
								customLightSquareStyle={customLightSquareStyle}
								customPieces={customPieces}
								boardWidth={boardSize}
								id="AnalysisBoard"
								position={chessBoardPosition}
								onPieceDrop={onDrop}
								boardOrientation={orientation}
							/>
						</div>
						<div className="border rounded-md  w-[400px] md:w-[350px] min-h-[200px] p-8 flex flex-col justify-center items-center gap-5 mt-5 md:mt-0 max-h-[500px]">
							<div className="font-bold  text-xl md:text-3xl">
								<span>История ходов</span>
							</div>
							{pgn.length ? (
								<div className="grid grid-cols-2 gap-2 overflow-y-auto pr-2">
									{pgn.map((move, index) => (
										<div
											key={index}
											className={`border p-2 rounded-md hover:bg-muted hover:cursor-pointer ${
												index === seletedMove ? 'bg-secondary font-bold' : ''
											}`}
											onClick={() => {
												setSelectedMove(index);
											}}
										>
											{index + 1}. {move}
										</div>
									))}
								</div>
							) : (
								<div>Пожалуйста загрузите партию</div>
							)}

							<div className="flex justify-center items-center gap-2">
								<Button
									className="hover:border hover:border-muted-foreground border border-background"
									variant="secondary"
									disabled={!pgn.length || seletedMove === 0}
									onClick={() => {
										setSelectedMove(0);
									}}
								>
									<ChevronsLeft />
								</Button>
								<Button
									className="hover:border hover:border-muted-foreground border border-background"
									variant="secondary"
									disabled={!pgn.length || seletedMove === 0}
									onClick={() => {
										setSelectedMove(prev => prev - 1);
									}}
								>
									<ChevronLeft />
								</Button>
								<Button
									className="hover:border hover:border-muted-foreground border border-background"
									variant="secondary"
									disabled={!pgn.length || seletedMove === pgn?.length - 1}
									onClick={() => {
										setSelectedMove(prev => prev + 1);
									}}
								>
									<ChevronRight />
								</Button>
								<Button
									className="hover:border hover:border-muted-foreground border border-background"
									variant="secondary"
									disabled={!pgn.length || seletedMove === pgn?.length - 1}
									onClick={() => {
										setSelectedMove(pgn.length - 1);
									}}
								>
									<ChevronsRight />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DefaultLayout>
		</div>
	);
};

export default FinishedGamePage;
