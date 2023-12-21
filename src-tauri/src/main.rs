#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use std::collections::HashMap;
use tauri::{State, Window};
use ulid::Ulid;
// Structures for the notebook and cells
use log::{info, warn, debug};

use env_logger;



struct Notebook {
    cells: HashMap<String, Cell>,
    cell_order: Vec<String>,
}

// TODO: Implement cell types markdown and code
struct Cell {
    id: String,
    content: String,
}

// AppState that holds the mapping from Window to Notebook
struct AppState {
    notebooks: Mutex<HashMap<String, Notebook>>,
}

impl AppState {
    fn new() -> Self {
        Self {
            notebooks: Mutex::new(HashMap::new()),
        }
    }

    fn create_notebook(&self, window_id: &str) {
        let mut notebooks = self.notebooks.lock().unwrap();
        notebooks.insert(window_id.to_string(), Notebook {
            cells: HashMap::new(),
            cell_order: Vec::new(),
        });
    }

    // Perform the cell execution within the AppState context
    fn execute_cell(&self, window_id: &str, cell_id: &str) -> bool {
        debug!(
            "Attempting to execute cell with ID: {} in window with ID: {}",
            cell_id,
            window_id
        );

        let mut notebooks = self.notebooks.lock().unwrap();
        if let Some(notebook) = notebooks.get_mut(window_id) {
            notebook.execute_cell(cell_id);
            true
        } else {
            false
        }
    }

    fn create_cell(&self, window_id: &str) -> Option<String> {
        debug!(
            "Creating a new cell in window with ID: {}",
            window_id
        );

        let mut notebooks = self.notebooks.lock().unwrap();
        if let Some(notebook) = notebooks.get_mut(window_id) {
            Some(notebook.create_cell())
        } else {
            None
        }
    }

    // Update a specific cell within the specified notebook
    fn update_cell(&self, window_id: &str, cell_id: &str, new_content: &str) -> bool {
        debug!(
            "Updating cell with ID: {} in window with ID: {} with new content: {}",
            cell_id,
            window_id,
            new_content
        );

        let mut notebooks = self.notebooks.lock().unwrap();
        if let Some(notebook) = notebooks.get_mut(window_id) {
            notebook.update_cell(cell_id, new_content);
            true
        } else {
            false
        }
    }
}

impl Notebook {
    fn execute_cell(&mut self, cell_id: &str) {
        if let Some(cell) = self.cells.get(cell_id) {
            warn!(
                "Execute Cell is not implemented yet. ID: {}, Content: {}",
                cell.id,
                cell.content
            );
        }
    
    }

    fn create_cell(&mut self) -> String {
        let cell_id = Ulid::new().to_string();
        let new_cell = Cell {
            id: cell_id.clone(),
            content: String::new(),
        };

        self.cells.insert(cell_id.clone(), new_cell);
        self.cell_order.push(cell_id.clone());

        debug!("Created cell with ID: {}", cell_id.clone());

        cell_id
    }

    // Method to update an existing cell in the notebook
    fn update_cell(&mut self, cell_id: &str, new_content: &str) {
        if let Some(cell) = self.cells.get_mut(cell_id) {
            cell.content = new_content.to_string();
        }
    }
}

#[tauri::command]
fn create_cell(state: State<AppState>, window: Window) -> Option<String> {
    let window_id = window.label(); // Use the window label as a unique identifier
    state.create_cell(window_id)
}

#[tauri::command]
fn execute_cell(state: State<AppState>, window: Window, cell_id: &str) -> bool {
    let window_id = window.label(); // Use the window label as a unique identifier
    state.execute_cell(window_id, cell_id)
}

#[tauri::command]
fn update_cell(state: State<AppState>, window: Window, cell_id: &str, new_content: &str) -> bool {
    let window_id = window.label(); // Use the window label as a unique identifier
    state.update_cell(window_id, cell_id, new_content)
}

// The main entry point for the Tauri application
fn main() {
    // TODO: Rely on actual app logs
    // TODO: Depend on environment variables for the level
    env_logger::Builder::new()
        .filter(None, log::LevelFilter::Debug)
        .init();


    let state = AppState::new();

    // HACK: Bootstrapping with only the main window.
    state.create_notebook("main");


    info!("Launching nteract on Tauri");
    tauri::Builder::default()
        .manage(state) // Add AppState to Tauri's managed state
        .invoke_handler(tauri::generate_handler![
            create_cell,
            execute_cell,
            update_cell
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
