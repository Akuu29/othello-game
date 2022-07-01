import { FC, useState, MouseEventHandler, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BoardMap, startGame } from './api/gameApi';
import './index.css';

const Square: FC<{
    squareValue: number;
    handleClick: MouseEventHandler
}> = ({squareValue, handleClick}) => {
    const stone = squareValue === 1 ? '●' :
        squareValue === 2 ? '○' : null;
    return (
        <button className="square" onClick={handleClick}>
            {stone}
        </button>
    );
};

const Board: FC = () => {
    const [squares, setSquares] = useState<BoardMap>();
    const [blackIsNext, setblackIsNext] = useState<boolean>(true);

    // 初期版面の設定
    useEffect(() => {
        const setInitialBoard = async () => {
            let initializeBoard = await startGame();
            setSquares(initializeBoard);
        };

        setInitialBoard();
    }, [])

    const handleClick = (h: number, w: number) => {
        const player = blackIsNext ? '●' : '○';
        // setSquares((prevSquares) => {
        //     let currentSquares = [...prevSquares];
        //     currentSquares[row][line] = player;
        //     return currentSquares;
        // });
        setblackIsNext(!blackIsNext);
    };

    const renderSquare = (line: Array<number>, h: number) => {
        return line.map((_, w) => (
            <Square
                squareValue={squares![h][w]}
                handleClick={() => handleClick(h, w)} />
        ))
    };

    const renderInitializeBoard = () => {
        if(squares) {
            return squares.map((line, h) => (
                <div className="board-row">
                    {renderSquare(line, h)}
                </div>
            ))
        }
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