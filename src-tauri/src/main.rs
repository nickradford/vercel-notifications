#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;
use crate::db::db::DB;
use tauri::SystemTray;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_token() -> String {
    let sql = DB::init().unwrap();

    let token: String = sql
        .conn
        .query_row("SELECT * FROM kvp WHERE key='vercel_token'", [], |row| {
            row.get(1)
        })
        .unwrap();

    token
}

fn main() {
    let tray = SystemTray::new();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_token])
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
