use std::env;
use actix_web::{App, HttpServer};
use actix_cors::Cors;
use dotenv::dotenv;

use crate::scopes::game_scope;
mod scopes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 環境変数ロード
    dotenv().ok();

    let host = env::var("HOST").expect("Please set HOST in .env");
    let port: u16 = env::var("PORT").expect("Please set PORT in .env").parse().unwrap();

    HttpServer::new(|| {
        // corsコントロール
        // permissiveはすべてのオリジン、メソッド、リクエストヘッダが許可される->実働環境NG
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .service(game_scope::get_scope())
    })
    .bind((host, port))?
    .run()
    .await
}