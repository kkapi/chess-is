<button
				onClick={() => {
					function splitPGN(pgnNotation) {
						// Разбиваем строку на отдельные ходы, используя пробел как разделитель
						let moves = pgnNotation.split(' ');

						// Удаляем номера ходов (цифры с точкой) из массива
						moves = moves.filter(move => isNaN(parseInt(move)));

						return moves;
					}

          const arr = splitPGN('1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#')
					console.log(arr);
          const test = new Chess();
          test.loadPgn(arr.join(' '));
          console.log(test.pgn());
				}
        
      }
			>
				click
			</button>