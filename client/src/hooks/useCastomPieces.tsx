import { CLIENT_URL } from '@/lib/constants';
import { useMemo } from 'react';

const pieces = [
	'wP',
	'wN',
	'wB',
	'wR',
	'wQ',
	'wK',
	'bP',
	'bN',
	'bB',
	'bR',
	'bQ',
	'bK',
];

const boardTheme = {
  brown: {
    dark: '#B48764',
    light: '#F0D8B6',
  },
  green: {
    dark: '#779952',
    light: '#edeed1',
  }
}

const pieceTheme = {
  l: 'l',
  c: 'c'
}

const customBoardStyle={
  borderRadius: '4px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
}

let options = JSON.parse(localStorage.getItem('options')) || {
  board: 'brown',
  pieces: 'c'
};

const bg = boardTheme[options.board] || boardTheme[brown];
const pc = pieceTheme[options.pieces] || pieceTheme['c']


const customDarkSquareStyle={ backgroundColor: bg.dark } //#B48764  #779952
const	customLightSquareStyle={ backgroundColor: bg.light }  //#F0D8B6 #edeed1

export default function useCastomPieces() {
	const customPieces = useMemo(() => {
		const pieceComponents = {};
		pieces.forEach(piece => {
			pieceComponents[piece] = ({ squareWidth }) => (
				<div
					style={{
						width: squareWidth,
						height: squareWidth,
						backgroundImage: `url(${CLIENT_URL}/${pc}-${piece}.png)`,
						backgroundSize: '100%',
					}}
				/>
			);
		});
		return pieceComponents;
	}, []);

  return {customBoardStyle, customDarkSquareStyle, customLightSquareStyle, customPieces}
}
