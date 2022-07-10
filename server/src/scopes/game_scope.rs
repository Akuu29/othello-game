use actix_web::{Scope, get, put, post, Responder, HttpResponse};
use actix_web::web::{self, Json, Query};
use serde_json::json;
use crate::game::model_game::GameInfo;

pub fn get_scope() -> Scope {
    web::scope("")
        .service(get_initial_board)
        // .service(update_board)
        .service(get_player_is_reversible)
        // .service(get_tips)
        .service(get_winner)
}

// 最初の版面を返却する
#[get("/")]
async fn get_initial_board() -> impl Responder {
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

    HttpResponse::Ok().json(json!({"status": "success", "board": board}))
}

// // 版面の更新
// #[put("/")]
// async fn update_board(game_info: Json<GameInfo>) -> impl Responder {
//     // 反転可能な石の座標取得する
//     let reversible_positions = game_info.get_reversible_positions();
//     // 反転可能な石がなかったら早期リターン
//     if reversible_positions.is_empty() {
//         return HttpResponse::UnprocessableEntity().json(json!({"status": "error"}));
//     }

//     // 反転後のボード
//     let board = game_info.set_stone_in_board(reversible_positions);

//     // ボードがすべて石で埋まっている場合。ゲーム終了
//     let game_is_continue = GameInfo::calculate_board_status(&board);
//     if !game_is_continue {
//         return HttpResponse::Ok().json(json!({"status": "success", "nextMove": "calculateWinner", "board": board}));
//     }

//     HttpResponse::Ok().json(json!({"status": "success", "nextMove": "continue", "board": board}))
// }

// プレイヤーが石の配置が可能な版面か判定
#[get("/player-is-reversible")]
async fn get_player_is_reversible(game_info: Query<GameInfo>) -> impl Responder {
    let player_is_reversible = game_info.calculate_player_is_reversible();
    let next_move = if player_is_reversible {"continue".to_string()} else {"path".to_string()};

    HttpResponse::Ok().json(json!({"status": "success", "nextMove": next_move}))
}

// ヒントの取得
// #[get("/tips")]
// async fn get_tips() -> impl Responder {
//     HttpResponse::Ok().json(json!({}))
// }

// 勝者の取得
#[post("/winner")]
async fn get_winner(game_info: Json<GameInfo>) -> impl Responder {
    let game_result = game_info.calculate_winner();

    HttpResponse::Ok().json(json!({"status": "success", "winner": game_result}))
}