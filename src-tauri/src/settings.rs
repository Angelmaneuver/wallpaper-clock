use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::mem;
use std::path::PathBuf;
use std::sync::Mutex;

const DIRECTORYNAME: &str = "wallpaper-clock";
const SETTINGS_FILENAME: &str = "settings.json";

#[cfg(target_os = "windows")]
fn get_config_root() -> PathBuf {
    let appdata = PathBuf::from(std::env::var("APPDATA").unwrap());
    appdata.join(DIRECTORYNAME)
}

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn get_config_root() -> PathBuf {
    let home = PathBuf::from(std::env::var("HOME").unwrap());
    home.join(DIRECTORYNAME)
}

trait Config {
    fn write_file(&self) {}
    fn read_file(&mut self) {}
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    image_path: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            image_path: "".to_string(),
        }
    }
}

impl Config for Settings {
    fn write_file(&self) {
        let config_file = get_config_root().join(SETTINGS_FILENAME);
        if !config_file.parent().unwrap().exists() {
            fs::create_dir_all(config_file.parent().unwrap()).unwrap();
        }
        let serialized = serde_json::to_string(self).unwrap();
        let mut file = fs::File::create(config_file).unwrap();
        file.write_all(&serialized.as_bytes()).unwrap();
    }

    fn read_file(&mut self) {
        let config_file = get_config_root().join(SETTINGS_FILENAME);
        let input = fs::read_to_string(config_file).unwrap();
        let deserialized: Self = serde_json::from_str(&input).unwrap();
        let _ = mem::replace(self, deserialized);
    }
}

impl Settings {
    pub fn new() -> Self {
        let config_file = get_config_root().join(SETTINGS_FILENAME);
        if !config_file.exists() {
            Self::default()
        } else {
            let mut settings = Self::default();
            settings.read_file();
            settings
        }
    }

    pub fn set_image_path(&mut self, new_image_path: String) {
        self.image_path = new_image_path;
        self.write_file();
        println!("{:?}", self);
    }
}

#[derive(Debug)]
pub struct AppState {
    settings: Mutex<Settings>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            settings: Mutex::from(Settings::new()),
        }
    }
}

pub mod commands {
    use super::*;

    #[tauri::command]
    pub async fn set_image_path(
        state: tauri::State<'_, AppState>,
        new_image_path: String,
    ) -> Result<(), String> {
        let mut settings = state.settings.lock().unwrap();
        settings.set_image_path(new_image_path);
        Ok(())
    }

    #[tauri::command]
    pub async fn get_settings(state: tauri::State<'_, AppState>) -> Result<Settings, String> {
        let settings = state.settings.lock().unwrap().clone();
        Ok(settings)
    }
}
