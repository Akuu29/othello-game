import axios, { AxiosError, AxiosResponse } from "axios";

export type BoardMap = Array<Array<number>>;

interface ResponseBasic {
    status: "success" | "error";
}

interface ResponseOnSuccess extends ResponseBasic{
    status: "success";
    nextMove?: "calculateWinner" | "continue" | "path";
    board?: BoardMap;
    winner?: string;
}

interface ResponseOnError extends ResponseBasic {
    status: "error";
}

type Response = AxiosResponse<ResponseOnSuccess | ResponseOnError> | undefined;

export class GameApi {
    static async getInitialBoard(): Promise<Response> {
        const response = await axios
            .get(process.env.REACT_APP_BACKEND_URL!)
            .catch((error: AxiosError | Error) => {
                return handleAxiosError(error);
            });

        return response;
    }
    // static async getPlayerIsReversible(squares: BoardMap, player: number): Promise<Response> {
    //     const config = {
    //         params: {
    //             stonePosition: [0, 0],
    //             board: squares,
    //             player
    //         }
    //     };

    //     const response = await axios
    //         .get(`${process.env.REACT_APP_BACKEND_URL!}/player-is-reversible`, config)
    //         .catch((error: AxiosError | Error) => {
    //             return handleAxiosError(error);
    //         });

    //     return response;
    // }
    static async updateBoard(
        stonePosition: Array<number>,
        squares: BoardMap,
        player: number): Promise<Response> {
        const body = {
            stone_position: stonePosition,
            board: squares,
            player
        };
        const response: Response = await axios
            .put(process.env.REACT_APP_BACKEND_URL!, body)
            .catch((error: AxiosError | Error) => {
                return handleAxiosError(error);
            });

        return response;
    }
    // static async getTips() {

    // }
    static async getWinner(squares: BoardMap): Promise<Response> {
        const body = {
            stone_position: [0, 0],
            board: squares,
            player: 0
        };
        // const config = {
        //     params: {
        //         squares
        //     }
        // };
        const response = await axios
            // .get(`${process.env.REACT_APP_BACKEND_URL!}/winner`, config)
            .post(`${process.env.REACT_APP_BACKEND_URL!}/winner`, body)
            .catch((error: AxiosError | Error) => {
                return handleAxiosError(error);
            })

        return response;
    }
}

const handleAxiosError = (error: AxiosError<ResponseOnError> | Error): AxiosResponse<ResponseOnError> | undefined => {
    if(axios.isAxiosError(error)) {
        // AxiosError
        if(error.response && typeof error.response.data != "object") {
            const data: ResponseOnError = {
                status: "error"
            };
            error.response.data = data;
        }
        return error.response;
    }
    // Error
    return undefined;
}