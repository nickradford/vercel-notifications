#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;

use crate::db::DB;
use log::info;
use simple_logger::SimpleLogger;
use tauri::SystemTray;

#[tauri::command]
fn get_token(handle: tauri::AppHandle) -> String {
    let sql = DB::init(handle).unwrap();

    let token: String = sql
        .conn
        .query_row("SELECT * FROM kvp WHERE key='vercel_token'", [], |row| {
            row.get(1)
        })
        .unwrap_or("".to_string());

    token
}

#[tauri::command]
fn set_token(handle: tauri::AppHandle, token: &str) -> bool {
    info!("Setting token to: {}", token);
    let sql = DB::init(handle).unwrap();
    match sql.conn.execute(
        "INSERT INTO kvp(key, value, type)
			VALUES (?1, ?2, ?3)
			ON CONFLICT (key) DO UPDATE SET value = ?2, type = ?3",
        ("vercel_token", token, "string"),
    ) {
        Ok(size) => {
            if size == 1 {
                true
            } else {
                false
            }
        }
        Err(err) => {
            info!("Error setting token: {}", err);
            false
        }
    }
}

#[tauri::command]
fn open_url(url: &str) -> () {
    match open::that(url) {
        Ok(..) => (),
        Err(err) => info!("Failed to open URL {}, {}", url, err),
    }
}

#[tauri::command]
fn get_projects(handle: tauri::AppHandle) -> Vec<String> {
    let sql = DB::init(handle).unwrap();

    let row: String = sql
        .conn
        .query_row("SELECT * FROM kvp WHERE key='projects'", [], |row| {
            row.get(1)
        })
        .unwrap_or("[]".to_string());

    let projects: Vec<String> = serde_json::from_str(&row.to_string()).unwrap();
    info!("Projects: {:?}", projects);

    projects
}

#[tauri::command]
fn set_projects(handle: tauri::AppHandle, projects: String) -> bool {
    info!("Setting projects to: {:?}", projects);
    let sql = DB::init(handle).unwrap();
    match sql.conn.execute(
        "INSERT INTO kvp(key, value, type)
    		VALUES (?1, ?2, ?3)
    		ON CONFLICT (key) DO UPDATE SET value = ?2, type = ?3",
        ("projects", projects, "string"),
    ) {
        Ok(size) => {
            if size == 1 {
                true
            } else {
                false
            }
        }
        Err(err) => {
            info!("Error setting projects: {}", err);
            false
        }
    }
}

fn main() {
    simple_logger::init_with_env().unwrap();
    let tray = SystemTray::new();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_token,
            set_token,
            get_projects,
            set_projects,
            open_url,
        ])
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
