// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::sync::Mutex;

use std::collections::HashMap;
use std::sync::Arc;
use tauri::{Manager, State, Window};

// Structures for the notebook and cells
use log::{debug, info};


use kernel_sidecar::client::Client;

use kernel_sidecar::handlers::{DebugHandler, Handler};
use kernel_sidecar::kernels::JupyterKernel;
use kernel_sidecar::notebook::Notebook;



// AppState that holds the mapping from Window to Notebook
struct AppState {
    // Notebooks are just the document model, and could exist even if there's no underlying kernel
    notebooks: Mutex<HashMap<String, Notebook>>,
    // kernels are subprocesses started by the main tauri process, this is mostly here to keep
    // a reference to them so they don't drop out of scope.
    kernels: Mutex<HashMap<String, JupyterKernel>>,
    // A kernel client is like jupyter_client in that it manages ZMQ connections to a Kernel. If
    // a kernel is started outside this app, we could connect to it given a connection file, so
    // kernel_clients map doesn't necessarily need to match 1:1 with kernels map
    kernel_clients: Mutex<HashMap<String, Client>>,
}

impl AppState {
    fn new() -> Self {
        Self {
            notebooks: Mutex::new(HashMap::new()),
            kernels: Mutex::new(HashMap::new()),
            kernel_clients: Mutex::new(HashMap::new()),
        }
    }

    async fn create_notebook(&self, window_id: &str) {
        let mut notebooks = self.notebooks.lock().await;
        let nb = Notebook::new();
        notebooks.insert(window_id.to_string(), nb);
    }

    async fn start_kernel(&self, window_id: &str) -> (JupyterKernel, Client) {
        info!("Starting kernel for window with ID: {}", window_id);
        let silent = true; // true = send ipykernel subprocess stdout to /dev/null
        let kernel = JupyterKernel::ipython(silent);
        let client = Client::new(kernel.connection_info.clone()).await;
        (kernel, client)
    }

    // Perform the cell execution within the AppState context
    async fn execute_cell(&self, window_id: &str, cell_id: &str) -> bool {
        debug!(
            "Executing cell with ID: {} in window with ID: {}",
            cell_id, window_id
        );
        let mut notebooks = self.notebooks.lock().await;
        let mut kernel_clients = self.kernel_clients.lock().await;
        if let Some(notebook) = notebooks.get_mut(window_id) {
            if let Some(cell) = notebook.get_cell(cell_id) {
                // Start kernel if it doesn't exist
                if !kernel_clients.contains_key(window_id) {
                    let (kernel, client) = self.start_kernel(window_id).await;
                    let mut kernels = self.kernels.lock().await;
                    kernels.insert(window_id.to_string(), kernel);
                    kernel_clients.insert(window_id.to_string(), client);
                }
                let kernel_client = kernel_clients.get(window_id).unwrap();

                let source = cell.get_source();
                let debug_handler = Arc::new(Mutex::new(DebugHandler::new()));
                let handlers: Vec<Arc<Mutex<dyn Handler>>> = vec![debug_handler.clone()];

                let action = kernel_client.execute_request(source, handlers);
                action.await;
                return true;
            }
        }
        false
    }

    // Return cell_id
    async fn create_cell(&self, window_id: &str) -> Option<String> {
        debug!("Creating a new cell in window with ID: {}", window_id);

        let mut notebooks = self.notebooks.lock().await;
        if let Some(notebook) = notebooks.get_mut(window_id) {
            let new_cell = notebook.add_code_cell("");
            Some(new_cell.id().to_string())
        } else {
            None
        }
    }

    // Update a specific cell within the specified notebook
    async fn update_cell(&self, window_id: &str, cell_id: &str, new_content: &str) -> bool {
        debug!(
            "Updating cell with ID: {} in window with ID: {} with new content: {}",
            cell_id, window_id, new_content
        );

        let mut notebooks = self.notebooks.lock().await;
        if let Some(notebook) = notebooks.get_mut(window_id) {
            if let Some(cell) = notebook.get_mut_cell(cell_id) {
                cell.set_source(new_content);
            }
            true
        } else {
            false
        }
    }
}

#[tauri::command]
async fn create_cell(state: State<'_, AppState>, window: Window) -> Result<Option<String>, String> {
    let window_id = window.label(); // Use the window label as a unique identifier
    Ok(state.create_cell(window_id).await)
}

#[tauri::command]
async fn execute_cell(
    state: State<'_, AppState>,
    window: Window,
    cell_id: &str,
) -> Result<bool, String> {
    let window_id = window.label(); // Use the window label as a unique identifier
    Ok(state.execute_cell(window_id, cell_id).await)
}

#[tauri::command]
async fn update_cell(
    state: State<'_, AppState>,
    window: Window,
    cell_id: &str,
    new_content: &str,
) -> Result<bool, String> {
    let window_id = window.label(); // Use the window label as a unique identifier
    Ok(state.update_cell(window_id, cell_id, new_content).await)
}

// The main entry point for the Tauri application
fn main() {
    // TODO: Rely on actual app logs
    // TODO: Depend on environment variables for the level
    env_logger::Builder::new()
        .filter(None, log::LevelFilter::Debug)
        .init();

    let state = AppState::new();

    info!("Launching nteract on Tauri");
    tauri::Builder::default()
        .manage(state) // Add AppState to Tauri's managed state
        .on_page_load(|window, _| {
            tauri::async_runtime::spawn(async move {
                let window_id = window.label(); // Use the window label as a unique identifier
                info!("Page loaded in window with ID: {}", window_id);
                let app = window.app_handle();
                app.state::<AppState>().create_notebook(window_id).await;
            });
        })
        .invoke_handler(tauri::generate_handler![
            create_cell,
            execute_cell,
            update_cell
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
