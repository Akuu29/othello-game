use serde::{Deserialize};
use std::{collections::HashMap, cmp::Ordering};

#[derive(Debug, Deserialize)]
pub struct GameInfo {
    pub stone_position: [i32; 2],
    pub board: [[u32; 8]; 8],
    pub player: u32
}

impl GameInfo {
    // 新規ボードの作成
    // pub fn new_board(self) -> [[u32; 8]; 8] {

    // }
    // 反転可能なポジションを取得
    pub fn get_reversible_positions(&self) -> Vec<[i32; 2]> {
        let movable_coordinates: [[i32; 2]; 8] = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];

        let mut total_reversible_positions = vec![];

        let h = self.stone_position[0];
        let w = self.stone_position[1];
        if self.board[h as usize][w as usize] != 0 {
            return total_reversible_positions;
        }

        for coordinate in movable_coordinates {
            let current_h = h;
            let current_w = w;
            let mut que = vec![[current_h, current_w]];
            let mut reversible_positions = vec![];
            while !que.is_empty() {
                let mut next_h = coordinate[0];
                let mut next_w = coordinate[1];
                if let Some(position) = que.pop() {
                    next_h += position[0];
                    next_w += position[1];
                }

                // ボード外になった場合
                if !(0..=7).contains(&next_h) ||
                    !(0..=7).contains(&next_w) {
                    reversible_positions = vec![];
                    break;
                }

                let next = self.board[next_h as usize][next_w as usize];
                if next == 0 {
                    // 石の配置がない場合
                    reversible_positions = vec![];
                    break;
                }else if next != self.player {
                    // 相手の石が配置してあった場合
                    reversible_positions.push([next_h, next_w]);
                    que.push([next_h, next_w]);
                }else {
                    // 自分の石が配置してあった場合
                    break;
                }
            }

            total_reversible_positions = [total_reversible_positions, reversible_positions].concat();
        }

        total_reversible_positions
    }
    // 石配置
    pub fn set_stone_in_board(&self, reversible_positions: Vec<[i32; 2]>) -> [[u32; 8]; 8] {
        let mut board = self.board;
        // playerが石を置いた場所の更新
        board[self.stone_position[0] as usize][self.stone_position[1] as usize] = self.player;

        // 反転
        for position in reversible_positions {
            let h = position[0] as usize;
            let w = position[1] as usize;
            board[h][w] = self.player;
        }

        board
    }
    // プレイヤーが石の配置可能か
    // true: 置ける false: 置けない
    pub fn calculate_player_is_reversible(&self) -> bool {
        let next_player = self.player;
        let next_board = self.board;

        // next_boardの中で石が配置されていない座標の取得
        let mut positions_nothing_place = vec![];
        for (h, line) in next_board.iter().enumerate() {
            for(w, point) in line.iter().enumerate() {
                if point == &0 {
                    positions_nothing_place.push([h as i32, w as i32]);
                }
            }
        }

        let mut player_is_reversible = false;
        for position in positions_nothing_place {
            let game_info = GameInfo {
                stone_position: position,
                board: next_board,
                player: next_player,
            };

            let revesible_positions = game_info.get_reversible_positions();
            if !revesible_positions.is_empty() {
                player_is_reversible = true;
                break;
            }
        }

        player_is_reversible
    }
    // ヒント
    // pub fn tip() {

    // }
    // ボードの版面の状況を調べる。
    // true: ゲーム続行 false: ゲーム終了
    // pub fn calculate_board_status(board: &[[u32; 8]; 8]) -> bool {
    //     let mut game_is_continue = false;
    //     'boardloop: for squares in board {
    //         for square in squares {
    //             if square == &0 {
    //                 game_is_continue = true;
    //                 break 'boardloop;
    //             }
    //         }
    //     }

    //     game_is_continue
    // }
    // 勝者判定
    pub fn calculate_winner(&self) -> String {
        let board = self.board;
        let mut stone_count: HashMap<&u32, i32> = HashMap::from([
            (&1, 0),
            (&2, 0)
        ]);

        for squares in board {
            for square in squares {
                if square != 0 {
                    *stone_count.get_mut(&square).unwrap() += 1;
                }
            }
        }

        let black = stone_count.get(&1).unwrap();
        let white = stone_count.get(&2).unwrap();

        match black.cmp(white) {
            Ordering::Greater => "winner: black".to_string(),
            Ordering::Less => "winner: white".to_string(),
            Ordering::Equal => "draw".to_string()
        }
    }
}