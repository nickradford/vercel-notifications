// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]

pub mod db {
    use rusqlite::{Connection, Result};

    pub struct DB {
        pub conn: Connection,
    }

    fn get_db() -> Result<Connection> {
        let path = "./db.sqlite";
        let db = Connection::open(path)?;

        Ok(db)
    }

    impl DB {
        pub fn init() -> Result<DB> {
            let conn = get_db().unwrap();

            match conn.execute(
                "CREATE TABLE IF NOT EXISTS kvp (
                    key TEXT PRIMARY KEY, 
                    value TEXT NOT NULL, 
                    type TEXT NOT NULL
                )",
                (),
            ) {
                Ok(..) => (),
                Err(error) => println!("Whoops...: {}", error),
            }

            Ok(DB { conn })
        }
    }
}
