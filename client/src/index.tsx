import { FC, useState, MouseEventHandler, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BoardMap, GameApi } from './api/gameApi';
import './index.css';

const Square: FC<{
    squareValue: number;
    handleClick: MouseEventHandler;
}> = ({squareValue, handleClick}) => {
    const stone = squareValue === 1 ? '●' :
        squareValue === 2 ? '○' : null;
    return (
        <button className="square" onClick={handleClick}>
            {stone}
        </button>
    );
};

const Board: FC<{
    squares: BoardMap | undefined;
    handleClick: any;
}> = ({
    squares,
    handleClick
}) => {

    const renderSquare = (line: Array<number>, h: number) => {
        return line.map((_, w) => (
            <Square
                squareValue={squares![h][w]}
                handleClick={() => handleClick(h, w)} />
        ))
    };

    const renderBoard = () => {
        return (
            <div>
                {squares && squares!.map((line, h) => (
                    <div className="board-row">
                        {renderSquare(line, h)}
                    </div>
                ))}
            </div>
        )
    };

    return (
        <div>
            {renderBoard()}
        </div>
    );
};

const Game: FC = () => {
    const [squares, setSquares] = useState<BoardMap>();
    const [squaresHistories, setSquaresHistories] = useState<Array<BoardMap>>([]);
    const [blackIsNext, setBlackIsNext] = useState<boolean>(true);
    const [blackIsNextHistories, setBlackIsNextHistories] = useState<Array<boolean>>([true]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    // const [pathCount, setPathCount] = useState<number>(0);
    const [winner, setWinner] = useState<string>();

    // 初期版面の設定
    useEffect(() => {
        setInitialBoard();
    }, [])

        // // プレイヤーが切り替わった時に、そのプレイヤーが石の配置が可能か確認する
    // // 配置不可能な場合、次のプレイヤーにパスする
    // // 次のプレイヤーも配置不可能の場合は、ゲーム終了とする
    // useEffect(() => {
    //     const calculateWinner = async () => {
    //         const resultGetWinner = await GameApi.getWinner(squares!);
    //         if(resultGetWinner) {
    //             const data = resultGetWinner.data;
    //             if(data.status === "success") {
    //                 const winner = data.winner;
    //                 // 勝者のポップアップ
    //                 // TODO
    //             }else {
    //                 // AxiosError
    //                 alert(`ERROR: ${resultGetWinner.status}`);
    //             }
    //         }else {
    //             // Error
    //             alert("ERROR");
    //         }
    //     };
    //     const calculatePlayerIsReversible = async () => {
    //         const player = blackIsNext ? 1 : 2;
    //         const resultGetPlayerIsReversible = await GameApi.getPlayerIsReversible(squares!, player);
    
    //         if(resultGetPlayerIsReversible) {
    //             const data = resultGetPlayerIsReversible.data;
    //             if(data.status === "success") {
    //                 if(data.nextMove === "path") {
    //                     setBlackIsNext(!blackIsNext);
    //                     setPathCount((prevPathConut) => prevPathConut++);
    //                     if(pathCount >= 2) {
    //                         calculateWinner();
    //                     }
    //                 }
    //             }else {
    //                 // AxiosError
    //                 alert(`ERROR: ${resultGetPlayerIsReversible.status}`);
    //             }
    //         }else {
    //             // Error
    //             alert("ERROR");
    //         }
    //     };

    //     calculatePlayerIsReversible();
    // }, [blackIsNext])

    // ボードの初期化
    const setInitialBoard = async () => {
        const resultGetInitialBaord = await GameApi.getInitialBoard();
        if(resultGetInitialBaord) {
            const data = resultGetInitialBaord.data;
            if(data.status === "success") {
                const board = data.board;
                setSquares(board);
                setSquaresHistories((prevHistory) => {
                    return prevHistory.concat([board!]);
                });
            }else {
                // AxiosError
                alert(`ERROR: ${resultGetInitialBaord.status}`);
            }
        }else {
            // Error
            alert("ERROR");
        }
    };

    const handleClick = async (h: number, w: number) => {
        const player = blackIsNext ? 1 : 2;
        const resultUpdateBoard = await GameApi.updateBoard([h, w], squares!, player);
        if(resultUpdateBoard) {
            const data = resultUpdateBoard.data;
            if(data.status === "success") {
                if(data.nextMove === "calculateWinner") {
                    calculateWinner(data.board!);
                }
                setBlackIsNext(!blackIsNext);
                setBlackIsNextHistories((prevHistory) => {
                    return prevHistory.concat(!blackIsNext);
                })
                setSquares(data.board);
                setSquaresHistories((prevHistory) => {
                    return prevHistory.concat([data.board!]);
                });
                setStepNumber((prevStepNumber) => prevStepNumber + 1);
            }else {
                // AxiosError
                // alert(`ERRROR: ${resultUpdateBoard.status}`);
            }
        }else {
            // Error
            alert("ERROR");
        }
    };

    const calculateWinner = async (board: BoardMap) => {
        const resultGetWinner = await GameApi.getWinner(board);
        if(resultGetWinner) {
            const data = resultGetWinner.data;
            if(data.status === "success") {
                const winner = data.winner;
                setWinner(winner);
            }else {
                // AxiosError
                alert(`ERROR: ${resultGetWinner.status}`);
            }
        }else {
            // Error
            alert("ERROR");
        }
    };

    const movesBtn = () => {
        const move = (movename: string) => {
            const action = movename === "prev" ? -1 : 1;
            const squaresHistory = squaresHistories[stepNumber + action];
            const blackIsNextHistory = blackIsNextHistories[stepNumber + action];
            setSquares(squaresHistory);
            setBlackIsNext(blackIsNextHistory);
            setStepNumber((prevStepNumber) => prevStepNumber + action);
        }
        return (
            <>
                {(stepNumber > 0) && 
                    <button onClick={() => move("prev")}>prev</button>
                }
                {(stepNumber < squaresHistories.length - 1) &&
                    <button onClick={() => move("next")}>next</button>
                }
            </>
        );
    };

    let status = `Next player: ${blackIsNext ? '●' : '○'}`;
    if(winner) status = winner;

    return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={squares}
                    handleClick={handleClick}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{movesBtn()}</ol>
            </div>
        </div>
    );
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Game />);