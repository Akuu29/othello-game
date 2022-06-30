import { FC, useState, MouseEventHandler } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square: FC<{
    squareValue: string | null;
    handleClick: MouseEventHandler
}> = ({squareValue, handleClick}) => {
    return (
        <button className="square" onClick={handleClick}>
            {squareValue}
        </button>
    );
};

const Board: FC = () => {
    const [squares, setSquares] = useState<Array<Array<string | null>>>([...Array(8)].map(() => Array(8).fill(null)));
    const [blackIsNext, setblackIsNext] = useState<boolean>(true);

    const handleClick = (row: number, line: number) => {
        const player = blackIsNext ? '●' : '○';
        setSquares((prevSquares) => {
            let currentSquares = [...prevSquares];
            currentSquares[row][line] = player;
            return currentSquares;
        });
        setblackIsNext(!blackIsNext);
    };

    const renderSquare = (square: Array<string | null>, row: number) => {
        return square.map((_, line) => (
            <Square
                squareValue={squares[row][line]}
                handleClick={() => handleClick(row, line)} />
        ))
    };

    const renderInitializeBoard = () => {
        return squares.map((square, row) => (
            <div className="board-row">
               {renderSquare(square, row)}
            </div>
        ))
    };

    const status = `Next player: ${blackIsNext ? '●' : '○'}`;

    return (
        <div>
            <div className="status">{status}</div>
            {renderInitializeBoard()}
        </div>
    );
};

const Game: FC = () => {
    return (
        <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Game />);
