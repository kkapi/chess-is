import useCastomPieces from '@/hooks/useCastomPieces';
import Engine from '@/stockfish/engine';
import { Chess, validateFen } from 'chess.js';
import { useEffect, useState, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Progress } from './ui/progress';
import useWindowDimensions from '@/hooks/useWindowDimensions ';
import { Button } from './ui/button';
import {
	Repeat2,
	Clipboard,
	RotateCcw,
	Undo2,
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ANALYSIS_ROUTE } from '@/lib/constants';

export const AnalysisGameBoard = () => {
	const engine = useMemo(() => new Engine(), []);
	const game = useMemo(() => new Chess(), []);

	const [input, setInput] = useState('');

	const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
	const [positionEvaluation, setPositionEvaluation] = useState(0);
	const [depth, setDepth] = useState(10);
	const [bestLine, setBestline] = useState('');
	const [possibleMate, setPossibleMate] = useState('');

	const [err, setError] = useState(false);

	const [boardSize, setBoardSize] = useState(500);
	const { height, width } = useWindowDimensions();

	const [pgn, setPgn] = useState([]);
	const [seletedMove, setSelectedMove] = useState(0);

	const [resultMessage, setResultMessage] = useState('');

	const [orientation, setOrientation] = useState('white');

	function splitPGN(pgnNotation) {
		// Разбиваем строку на отдельные ходы, используя пробел как разделитель
		let moves = pgnNotation.split(' ');

		// Удаляем номера ходов (цифры с точкой) из массива
		moves = moves.filter(move => isNaN(parseInt(move)));

		return moves;
	}

	const arr = splitPGN('1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#');

	useEffect(() => {
		if (width < 500) {
			setBoardSize(350);
		} else {
			setBoardSize(500);
		}
	}, [width]);

	function findBestMove() {
		engine.evaluatePosition(chessBoardPosition, 18);

		engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
			if (depth < 10) return;

			positionEvaluation &&
				setPositionEvaluation(
					((game.turn() === 'w' ? 1 : -1) * Number(positionEvaluation)) / 100
				);
			possibleMate && setPossibleMate(possibleMate);
			depth && setDepth(depth);
			pv && setBestline(pv);
		});
	}

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

	function onDrop(sourceSquare, targetSquare, piece) {
		const move = game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: piece[1].toLowerCase() ?? 'q',
		});
		setPossibleMate('');
		setChessBoardPosition(game.fen());

		// illegal move
		if (move === null) return false;

		engine.stop();
		setBestline('');

		if (game.isGameOver() || game.isDraw()) {
			setResultMessage(getResultMessage());
			return false;
		}

		return true;
	}

	useEffect(() => {
		if (!game.isGameOver() || game.isDraw()) {
			findBestMove();
		}
	}, [chessBoardPosition]);

	const bestMove = bestLine?.split(' ')?.[0];

	const {
		customBoardStyle,
		customDarkSquareStyle,
		customLightSquareStyle,
		customPieces,
	} = useCastomPieces();

	function getProgressValue(positionEvaluation) {
		if (isNaN(positionEvaluation)) return 50;
		if (positionEvaluation < 0) {
			positionEvaluation = Math.min(
				95,
				50 +
					Math.abs(positionEvaluation) *
						(Math.abs(positionEvaluation) > 3 ? 7 : 5)
			);
		} else {
			positionEvaluation = Math.max(
				5,
				50 - positionEvaluation * (positionEvaluation > 3 ? 7 : 5)
			);
		}
		return positionEvaluation;
	}

	useEffect(() => {
		if (!input) setError(false);
	}, [input]);

	useEffect(() => {
		game.loadPgn(pgn.slice(0, seletedMove + 1).join(' '));
		setChessBoardPosition(game.fen());
	}, [seletedMove]);

	return (
		<div className="container w-[100wv] min-h-[80vh] flex justify-center items-center flex-col mt-5 md:mt-0">
			<div className="flex flex-col md:flex-row justify-center items-center md:gap-12">
				<div className="border rounded-md  w-[400px] md:w-[500px] min-h-[200px] p-8 flex flex-col justify-center items-center gap-5">
					<div className="font-bold  text-xl md:text-4xl">
						{resultMessage ? <>{resultMessage}</> : <span>Анализ партии</span>}
					</div>

					<div className="w-4/5 h-[180px] text-base">
						<div>
							Оценка позиции:{' '}
							<span className="font-bold">
								{possibleMate ? `#${possibleMate}` : positionEvaluation}
							</span>
						</div>
						<div>
							Глубина: <span className="font-bold">{depth}</span>
						</div>

						<h5>
							{bestLine.length ? (
								<>
									Лучшая линия:{' '}
									<span className="font-bold">
										{bestLine.slice(0, 40)} . . .
									</span>
								</>
							) : (
								''
							)}
						</h5>
						<div className="italic mt-2">
							{err && <>Некорректный формат PGN</>}
						</div>
						<div className="flex gap-2 items-center mt-2">
							<input
								className="border p-2 rounded-lg"
								value={input}
								placeholder="Загрузить PGN"
								onChange={e => {
									setInput(e.target.value);
								}}
							/>
							<Button
								onClick={() => {
									console.log(input);
									try {
                    let str = input;
                    if (input.includes(']')) {
                      const i = input.lastIndexOf(']')
                      str = input.slice(i + 1).trim();
                    }
										game.loadPgn(str);
										game.deleteComments();
										const moves = splitPGN(game.pgn());
										setPgn(moves);
										setChessBoardPosition(game.fen());
									} catch (e) {
										setError(true);
									}
								}}
							>
								Сохранить
							</Button>
						</div>
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

					<div className="flex justify-center items-center gap-4">
						<Button
							onClick={() => {
								game.reset();
								setResultMessage('');
								setInput('');
								setChessBoardPosition(game.fen());
								setPgn([]);
							}}
							className="flex justify-center items-center gap-2"
							variant="outline"
              disabled={!game.pgn()}
						>
							Очистить доску
							<RotateCcw />
						</Button>
						<div className="text-center text-sm">
							<Link to={ANALYSIS_ROUTE} className="underline">
								Анализ позиции
							</Link>
						</div>
					</div>
				</div>
				<div className={`w-[${boardSize}px] h-[${boardSize}px mt-9 md:mt-0`}>
					<Chessboard
						customBoardStyle={customBoardStyle}
						customDarkSquareStyle={customDarkSquareStyle}
						customLightSquareStyle={customLightSquareStyle}
						customPieces={customPieces}
						boardWidth={boardSize}
						id="AnalysisBoard"
						position={chessBoardPosition}
						onPieceDrop={onDrop}
						customArrows={
							bestMove && [
								[
									bestMove.substring(0, 2) as Square,
									bestMove.substring(2, 4) as Square,
									'rgb(0, 128, 0)',
								],
							]
						}
						boardOrientation={orientation}
					/>
					<div className={`w-[${boardSize}px] p-4 border mt-4 rounded-xl`}>
						<Progress
							value={getProgressValue(positionEvaluation)}
							max={50}
							className="w-full"
						/>
					</div>
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
	);
};
