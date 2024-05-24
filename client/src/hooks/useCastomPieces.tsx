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

const customBoardStyle={
  borderRadius: '4px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
}

const customDarkSquareStyle={ backgroundColor: '#779952' }
const	customLightSquareStyle={ backgroundColor: '#edeed1' }

export default function useCastomPieces() {
	const customPieces = useMemo(() => {
		const pieceComponents = {};
		pieces.forEach(piece => {
			pieceComponents[piece] = ({ squareWidth }) => (
				<div
					style={{
						width: squareWidth,
						height: squareWidth,
						backgroundImage: `url(${CLIENT_URL}/${piece}.png)`,
						backgroundSize: '100%',
					}}
				/>
			);
		});
		return pieceComponents;
	}, []);

  return {customBoardStyle, customDarkSquareStyle, customLightSquareStyle, customPieces}
}
