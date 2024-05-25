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
	},
	blue: {
		dark: '#5980b9',
		light: '#cadaf3',
	},
	purple: {
		dark: '#8467a5',
		light: '#e4daf1',
	},
};

const pieceTheme = {
	a: {
		prefix: 'a',
		type: '.svg',
	},
	c: {
		prefix: 'c',
		type: '.png',
	},
  n: {
    prefix: 'n',
    type: '.svg',
  }
};

const customBoardStyle = {
	borderRadius: '4px',
	boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
};

export default function useCastomPieces() {
	let options = JSON.parse(localStorage.getItem('options')) || {
		board: 'brown',
		pieces: 'c',
	};

	const bg = boardTheme[options.board] || boardTheme.brown;
	const pc = pieceTheme[options.pieces] || pieceTheme.c;

	const customDarkSquareStyle = { backgroundColor: bg.dark };
	const customLightSquareStyle = { backgroundColor: bg.light };

	const customPieces = useMemo(() => {
		const pieceComponents = {};
		pieces.forEach(piece => {
			pieceComponents[piece] = ({ squareWidth }) => (
				<div
					style={{
						width: squareWidth,
						height: squareWidth,
						backgroundImage: `url(${CLIENT_URL}/${pc.prefix}-${piece}${pc.type})`, //
						backgroundSize: '100%',
					}}
				/>
			);
		});
		return pieceComponents;
	}, []);

	return {
		customBoardStyle,
		customDarkSquareStyle,
		customLightSquareStyle,
		customPieces,
	};
}
