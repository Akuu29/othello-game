use actix_web::{Scope, get, post, Responder, HttpResponse};
use actix_web::web::{self, Json};
use serde_json::json;
use crate::game::model_game::GameInfo;

pub fn get_scope() -> Scope {
    web::scope("")
        .service(start_game)
        .service(set_stone_in_board)
}

// 最初の版面を返却する
#[get("/")]
async fn start_game() -> impl Responder {
    let mut board:[[u32; 8]; 8] = [[0; 8]; 8];
    let first_coordinates = [
        [3, 3],
        [3, 4],
        [4, 3],
        [4, 4]
    ];

    for first_coordinate in first_coordinates {
        let row = first_coordinate[0];
        let line = first_coordinate[1];
        let stone = if (row + line) % 2 == 0 {1} else {2};
        board[row][line] = stone;
    }

    HttpResponse::Ok().json(json!({"board": board}))
}

// 版面の更新
#[post("/")]
async fn set_stone_in_board(game_info: Json<GameInfo>) -> impl Responder {
    // 反転可能な石の座標取得する
    let reversible_positions = game_info.return_reversible_positions();

    // 反転可能な石がなかったら早期リターン
    if reversible_positions.is_empty() {
        return HttpResponse::UnprocessableEntity().finish();
    }

    // 反転後のボード
    let board = game_info.set_stone_in_board(reversible_positions);

    // 次のプレイヤーが石を配置可能か
    // 配置不可能な場合、status'skipToNextPlayer'をレスポンスのjsonに追加し返却
    let next_player_is_reversible = game_info.next_player_is_reversible(&board);
    if !next_player_is_reversible {
        return HttpResponse::Ok().json(json!({"board": board, "status": "skipToNextPlayer"}));
    }

    HttpResponse::Ok().json(json!({"board": board, "status": "success"}))
}