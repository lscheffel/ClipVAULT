# ClipVault

ClipVault is a simple and lightweight clipboard manager that runs in your system tray. It keeps a history of the text you copy, allowing you to easily access and manage your clipboard history.

## Features

*   **Clipboard Monitoring:** Automatically saves any text you copy to the clipboard.
*   **System Tray Integration:** Runs discreetly in the system tray.
*   **Web-Based UI:** View and manage your clipboard history through a simple web-based interface.
*   **History Management:**
    *   Copy items from your history back to the clipboard.
    *   Delete individual items from your history.
    *   Save clipboard items to a text file.
*   **Data Export:** Export your entire clipboard history to a JSON file for backup or analysis.

## Technologies Used

*   **Backend:** Python
*   **GUI:** `pywebview` (to create a web-based window)
*   **System Tray:** `pystray`
*   **Clipboard Access:** `pyperclip`
*   **Database:** SQLite

## Installation and Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ClipVAULT.git
    cd ClipVAULT
    ```

2.  **Install dependencies:**
    It's recommended to use a virtual environment.
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```
    Install the required Python packages:
    ```bash
    pip install pywebview pystray pyperclip Pillow
    ```

3.  **Run the application:**
    ```bash
    python main.py
    ```
    The application will start and an icon will appear in your system tray. Double-click the tray icon to open the clipboard history window.

## How it Works

*   The application runs a background thread that monitors the system clipboard for any changes.
*   When new text is copied, it's saved into an SQLite database (`clipboard.db`).
*   The main application provides a web-based user interface using `pywebview`.
*   The UI communicates with the Python backend to fetch the history, copy items, and delete items.
*   The system tray icon provides options to show the window, export data, and exit the application.
