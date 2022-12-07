use rusqlite::{Connection, Result};

pub struct DB {
    pub conn: Connection,
}

impl DB {
    pub fn init() -> Result<DB> {
        let conn = DB::get_db().unwrap();

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

    fn get_db() -> Result<Connection> {
        let path = "./db.sqlite";
        let db = Connection::open(path)?;

        Ok(db)
    }
}
