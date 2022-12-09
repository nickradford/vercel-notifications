use log::{error, info};
use rusqlite::{Connection, Result};
use std::fs::create_dir;
pub struct DB {
    pub conn: Connection,
}

impl DB {
    pub fn init(handle: tauri::AppHandle) -> Result<DB> {
        let conn = DB::get_db(handle).unwrap();

        match conn.execute(
            "CREATE TABLE IF NOT EXISTS kvp (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    type TEXT NOT NULL
                )",
            (),
        ) {
            Ok(..) => (),
            Err(error) => error!("Whoops...: {}", error),
        }

        Ok(DB { conn })
    }

    fn get_db(handle: tauri::AppHandle) -> Result<Connection> {
        let base = handle
            .path_resolver()
            .app_data_dir()
            .expect("Failed to get app data dir");

        let path: std::path::PathBuf;

        if !base.is_dir() {
            path = match create_dir(&base) {
                Ok(..) => base.join(&"db.sqlite"),
                Err(_) => panic!("Failed to create app data dir"),
            };
        } else {
            path = base.join(&"db.sqlite");
        }

        info!("DB path: {}", path.display());

        let db = match Connection::open(&path) {
            Ok(connection) => connection,
            _ => panic!("Whoops...: Failed to open database"),
        };

        Ok(db)
    }
}
