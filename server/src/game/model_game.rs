use serde::{Deserialize};

#[derive(Deserialize)]
pub struct GameInfo {
    pub stone_position: [i32; 2],
    pub board: [[u32; 8]; 8],
    pub player: u32
}

// pub struct Board {
    
// }

impl GameInfo {
    // 新規ボードの作成
    // pub fn new_board(self) -> [[u32; 8]; 8] {

    // }
    // 石が配置可能となるポジションを返す
    pub fn return_reversible_positions(&self) -> Vec<[i32; 2]> {
        let moveable_coordinates: [[i32; 2]; 8] = [
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
        println!("{}", h);
        println!("{}", w);
        println!("/");
        if self.board[h as usize][w as usize] != 0 {
            return total_reversible_positions;
        }

        for coordinate in moveable_coordinates {
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

        dbg!(&total_reversible_positions);

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

    // pub fn tip() {

    // }

    // pub fn calculate_winner() {

    // }
}