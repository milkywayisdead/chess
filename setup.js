function drawChessboard(){
	// нарисовать доску

	let chessboard = document.getElementById('chessboard').children[0];
	let lettersRow = document.createElement('tr');
	let corner = document.createElement('td');
	corner.classList.add('ch-corner');
	lettersRow.append(corner);

	for(let file = 1; file < 9; file++){
		let letter = document.createElement('td');
		letter.innerHTML = letters[file];
		lettersRow.append(letter);
	}
	let rightCorner = corner.cloneNode();
	lettersRow.append(rightCorner);
	chessboard.append(lettersRow);

	for(let rank = 1; rank < 9; rank++){
		let row = document.createElement('tr');
		let leftField = document.createElement('td');		
		let rightField = document.createElement('td');
		leftField.innerHTML = rank;
		rightField.innerHTML = rank;
		leftField.classList.add('ch-left-field');
		rightField.classList.add('ch-right-field');
		row.append(leftField);
		
		for(let file = 1; file < 9; file++){

			let cell = document.createElement('td');
			cell.dataset.file = file;
			cell.dataset.rank = rank;

			if (rank % 2 === 0) {
				if (file % 2 !== 0){
					cell.classList.add('square-wh', 'square');
				} else {
					cell.classList.add('square-bl', 'square');
				}	
				
			} else {
				if (file % 2 !== 0){
					cell.classList.add('square-bl', 'square');
				} else {
					cell.classList.add('square-wh', 'square');
				}
				
			}

			row.append(cell);
		}

		row.append(rightField);
		chessboard.prepend(row);
	}

	let topLettersRow = lettersRow.cloneNode(true);
	chessboard.prepend(topLettersRow);
}

function placePieces(){
	// расставить фигуры

	// пешки
	for(let i = 1; i < 9; i++){
		let blPawn = new Pawn('black', i, 7);
		let whPawn = new Pawn('white', i, 2);
		blPawn.takeSquare();
		whPawn.takeSquare();
	}

	// ладьи
	for(let rook of [
			new Rook('white', 1, 1), new Rook('black', 1, 8),
			new Rook('black', 8, 8), new Rook('white', 8, 1)
		]){
		rook.takeSquare();
	}

	// кони
	for(let knight of [
			new Knight('white', 2, 1), new Knight('black', 2, 8),
			new Knight('black', 7, 8), new Knight('white', 7, 1)
		]){
		knight.takeSquare();
	}

	// слоны
	for(let bishop of [
			new Bishop('white', 3, 1), new Bishop('black', 3, 8),
			new Bishop('black', 6, 8), new Bishop('white', 6, 1)
		]){
		bishop.takeSquare();
	}

	// ферзи
	new Queen('black', 4, 8).takeSquare();
	new Queen('white', 4, 1).takeSquare();

	// короли
	new King('black', 5, 8).takeSquare();
	new King('white', 5, 1).takeSquare();
}