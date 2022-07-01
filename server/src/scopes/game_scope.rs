use actix_web::{web, Scope, get, Responder, HttpResponse};
use serde_json::json;

pub fn get_scope() -> Scope {
    web::scope("")
        .service(start_game)
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