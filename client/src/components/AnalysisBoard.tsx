import Engine from "@/stockfish/engine";
import { Chess, validateFen } from "chess.js";
import { useEffect, useState, useMemo, useRef } from "react";
import { Chessboard } from "react-chessboard";

export const AnalysisBoard = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const inputRef = useRef();
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestline] = useState("");
  const [possibleMate, setPossibleMate] = useState("");

  function findBestMove() {
    engine.evaluatePosition(chessBoardPosition, 18);

    engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
      if (depth < 10) return;

      positionEvaluation &&
        setPositionEvaluation(
          ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
        );
      possibleMate && setPossibleMate(possibleMate);
      depth && setDepth(depth);
      pv && setBestline(pv);
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setPossibleMate("");
    setChessBoardPosition(game.fen());

    // illegal move
    if (move === null) return false;

    engine.stop();
    setBestline("");

    if (game.isGameOver() || game.isDraw()) return false;

    return true;
  }

  useEffect(() => {
    if (!game.isGameOver() || game.isDraw()) {
      findBestMove();
    }
  }, [chessBoardPosition]);

  const bestMove = bestLine?.split(" ")?.[0];
  const handleFenInputChange = (e) => {
    const { ok } = validateFen(e.target.value);

    if (ok) {
      inputRef.current.value = e.target.value;
      game.load(e.target.value);
      setChessBoardPosition(game.fen());
    }
  };
  
  return (
    <div className='container w-[100wv] h-[100vh] flex justify-center items-center flex-col'>
      <h4>
        Position Evaluation:{" "}
        {possibleMate ? `#${possibleMate}` : positionEvaluation}
        {"; "}
        Depth: {depth}
      </h4>
      <h5>
        Best line: <i>{bestLine.slice(0, 40)}</i> ...
      </h5>
      <input
        ref={inputRef}
        onChange={handleFenInputChange}
        placeholder="Paste FEN to start analysing custom position"
      />
       <Chessboard
        boardWidth={500}
        id="AnalysisBoard"
        position={chessBoardPosition}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customArrows={
          bestMove && [
            [
              bestMove.substring(0, 2) as Square,
              bestMove.substring(2, 4) as Square,
              "rgb(0, 128, 0)",
            ],
          ]
        }
      />
       <button
        onClick={() => {
          setPossibleMate("");
          setBestline("");
          game.reset();
          setChessBoardPosition(game.fen());
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          setPossibleMate("");
          setBestline("");
          game.undo();
          setChessBoardPosition(game.fen());
        }}
      >
        undo
      </button>
    </div>
  )
};