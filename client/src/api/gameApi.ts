import axios from "axios";

export type BoardMap = Array<Array<number>>;

export class GameApi {
    static async startGame(): Promise<BoardMap> {
        let response = await axios.get(process.env.REACT_APP_BACKEND_URL!);
        return await response.data.board;
    }
    static async setStoneInBoard(stonePosition: Array<number>, squares: BoardMap, player: number): Promise<BoardMap | null> {
        let body = {
            stone_position: stonePosition,
            board: squares,
            player
        };
        let response = await axios
            .post(process.env.REACT_APP_BACKEND_URL!, body)
            .catch(() => {
                return null;
            });
        return response ? await response.data.board : response;
    }
}