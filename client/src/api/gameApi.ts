import axios from "axios";

export type BoardMap = Array<Array<number>>;

export class GameApi {
    static async startGame(): Promise<BoardMap> {
        let response = await axios.get(process.env.REACT_APP_BACKEND_URL!);
        return await response.data.board;
    }
}