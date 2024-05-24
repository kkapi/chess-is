import Engine from '@/stockfish/engine';
import { Chess } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Button } from '@/components/ui/button';

import { Clipboard, Undo2, RotateCcw, Repeat2 } from 'lucide-react';
import useWindowDimensions from '@/hooks/useWindowDimensions ';

export const PlayVsComputer = () => {
	const levels = {
		Легкий: 2,
		Средний: 8,
		Сложный: 18,
	};

	const [boardSize, setBoardSize] = useState(500);
	const { height, width } = useWindowDimensions();

	const [orientation, setOrientation] = useState('white');

	const engine = useMemo(() => new Engine(), []);
	const game = useMemo(() => new Chess(), []);

	const [gamePosition, setGamePosition] = useState(game.fen());
	const [stockfishLevel, setStockfishLevel] = useState(2);

	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
		if (width < 500) {
			setBoardSize(350);
		} else {
			setBoardSize(500);
		}
	}, [width]);

	function getResultMessage() {
		let mes = '';

		if (game.isGameOver()) {
			if (game.isCheckmate()) {
				mes = `Мат! ${game.turn() === 'w' ? 'Черные' : 'Белые'} победили!`;
			} else if (game.isDraw()) {
				if (game.isThreefoldRepetition()) {
					mes = `Ничья! Тройное повторение ходов!`;
				} else if (game.isInsufficientMaterial()) {
					mes = `Ничья! Недостаточное количество материала`;
				} else if (game.isStalemate()) {
					mes = `Ничья! Пат!`;
				}
			} else {
				mes = `Игра окончена!`;
			}
		}

		return mes;
	}

	function findBestMove() {
		engine.evaluatePosition(game.fen(), stockfishLevel);

		engine.onMessage(({ bestMove }) => {
			if (bestMove) {
				game.move({
					from: bestMove.substring(0, 2),
					to: bestMove.substring(2, 4),
					promotion: bestMove.substring(4, 5),
				});

				setGamePosition(game.fen());
				if (game.isGameOver() || game.isDraw()) {
					setResultMessage(getResultMessage());
				}
			}
		});
	}

	function onDrop(sourceSquare, targetSquare, piece) {
		const move = game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: piece[1].toLowerCase() ?? 'q',
		});
		setGamePosition(game.fen());

		if (move === null) return false;

		if (game.isGameOver() || game.isDraw()) {
			setResultMessage(getResultMessage());
			return false;
		}

		findBestMove();

		return true;
	}

	return (
		<div className="flex gap-1 md:gap-10 flex-col md:flex-row justify-center items-center">
			<div className="border rounded-md  w-[400px] md:w-[500px] min-h-[200px] p-8 flex flex-col justify-center items-center gap-5">
				<div className="font-bold text-2xl">
					{resultMessage ? <>{resultMessage}</> : <>Игра против компьютера</>}
				</div>
				<div className="flex gap-2 justify-center items-center">
					{Object.entries(levels).map(([level, depth]) => (
						<Button
							key={level}
							className={stockfishLevel === depth ? 'bg-secondary border-2 py-5' : ''}
							variant="outline"
							
							onClick={() => setStockfishLevel(depth)}
						>
							{level}
						</Button>
					))}
				</div>
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
								setOrientation(prev => (prev === 'white' ? 'black' : 'white'));
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

				<div className="flex justify-center items-center gap-4">
					<Button
						onClick={() => {
							game.reset();
							setGamePosition(game.fen());
						}}
						className="flex justify-center items-center gap-2"
						variant="outline"
					>
						Новая игра
						<RotateCcw />
					</Button>
					<Button
						onClick={() => {
							game.undo();
							game.undo();
							setGamePosition(game.fen());
						}}
						className="flex justify-center items-center gap-2"
						variant="outline"
					>
						<Undo2 />
						Назад
					</Button>
				</div>
			</div>
			<div className={`w-[${boardSize}px] h-[${boardSize}px mt-9 md:mt-0`}>
				<Chessboard
					id="PlayVsStockfish"
					position={gamePosition}
					onPieceDrop={onDrop}
					boardWidth={boardSize}
					boardOrientation={orientation}
				/>
			</div>
		</div>
	);
};
