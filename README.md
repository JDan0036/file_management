# File Management System
This project is a web-based file management system that allows users to navigate folders, view files, rename items, download files/folders, and manage folder/file information. The application is built with a Vue.js frontend and an Express.js backend, using SQLite for data storage.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [CRUD Operations for Folders](#crud-operations-for-folders)
- [CRUD Operations for Files](#crud-operations-for-files)
- [Styling Notes](#styling-notes)
- [Future Improvements](#future-improvements)

## Features

- **Folder Navigation**: Clickable folder rows for easy navigation within folder structure.
- **File Management**: Upload files to specific folders, download files and folders (as ZIP), and delete items.
- **Rename and Information Modals**: Use modals for renaming items and viewing folder/file details without using alerts.
- **User-Friendly UI**: Smooth animations and clear visual feedback on interactive elements.

## Project Structure

```
FILE_MANAGEMENT/
├── config/
│   ├── database.js             # SQLite database setup and schema
│   └── delete.js               # Script for deleting entries in the database
├── frontend/                   # Vue.js frontend
│   ├── node_modules/           # Node modules for frontend dependencies
│   ├── public/                 # Public directory for frontend assets
│   ├── src/                    # Main source code for the frontend
│   │   ├── assets/             # Images for folder and file icons
│   │   ├── components/
│   │   │   ├── FileList.vue    # Main file/folder management component
│   │   │   ├── InfoModal.vue   # Modal component for displaying item details
│   │   │   └── RenameModal.vue # Modal component for renaming items
│   │   ├── services/
│   │   │   └── api.js          # Axios configuration for API calls
│   │   └── App.vue             # Root component for the frontend
│   ├── .gitignore              # Git ignore file for frontend
│   ├── babel.config.js         # Babel configuration
│   ├── jsconfig.json           # JavaScript configuration for frontend
│   ├── package.json            # Package dependencies for frontend
│   ├── package-lock.json       # Lock file for frontend dependencies
│   ├── README.md               # README specific to the frontend (if exists)
│   └── vue.config.js           # Vue configuration file
├── node_modules/               # Node modules for backend dependencies
├── routes/
│   ├── files.js                # File-related API routes
│   └── folders.js              # Folder-related API routes
├── uploads/                    # Directory for uploaded files
│   └── testing-file            # Testing purpose to check for uploading files
├── your-database.db            # SQLite database file
├── .gitignore                  # Git ignore file for the backend
├── index.js                    # Main entry point for the Express server
├── package.json                # Package dependencies for backend
├── package-lock.json           # Lock file for backend dependencies
└── README.md                   # Project README file
```

---

## Setup Instructions

### Prerequisites

- Node.js and npm
- SQLite3 and 

### 1. Backend Setup

1. **Navigate to the root directory**:
   ```bash
   cd FILE_MANAGEMENT
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure the SQLite database**: The database schema is automatically created on server startup based on `config/database.js`.

4. **Run the backend server**:
   ```bash
   nodemon index.js
   ```
   The backend server will start at `http://localhost:3000`.
   If Error gotten, please follow this instructions for downloading nodemon: </br> "https://stackoverflow.com/questions/40359590/nodemon-command-is-not-recognized-in-terminal-for-node-js-server/53711051#53711051" 

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend development server**:
   ```bash
   npm run serve
   ```
   Access the frontend at `http://localhost:8080`.

---

## Usage

- **Folder Navigation**: Click anywhere in the folder row (excluding the action button) to open the folder.
- **Renaming Items**: Use the action button (⋮) to open a rename modal for folders or files.
- **Viewing Details**: Open item details with the action menu to view folder or file information in a modal.
- **Downloading Files/Folders**: Download options are available in the action menu; folders download as `.zip`.
- **Deleting Items**: Select "Delete" in the action menu to remove items.

---

## API Endpoints

The backend API provides routes for file and folder management:

### Folders

- `GET /folders` - Retrieve all folders and their contents.
- `POST /folders` - Create a new folder.
- `PUT /folders/:id` - Rename a folder and update all nested paths.
- `DELETE /folders/:id` - Delete a folder and its contents.
- `GET /folders/download/:id` - Download a folder as a ZIP file.

### Files

- `POST /files` - Upload a file.
- `GET /files` - Retrieve all files.
- `PUT /files/:id` - Rename a file.
- `DELETE /files/:id` - Delete a file.
- `GET /files/download/:id` - Download a file.

---

## CURD Operations for Folders

#### 1. **Create Folder**
   - **Endpoint**: `POST /folders`
   - **Description**: Creates a new folder within a specified parent folder.
   - **Request Body**:
     ```json
     {
       "name": "FolderName",
       "parentId": 1  // Optional, specifies the parent folder ID
     }
     ```
   - **Functionality**:
     - A new folder is created with the specified `name` and `parentId`. 
     - If a `parentId` is provided, the folder path is set relative to the parent folder.
   - **Database Action**: Insert a new row in the `folders` table.

#### 2. **Read Folders and Files**
   - **Endpoint**: `GET /folders`
   - **Description**: Retrieves all folders and their associated files.
   - **Functionality**:
     - Fetches all folders and files from the database.
     - Filters folders by `parentId` to structure the folder hierarchy.
   - **Database Action**: Select all folders and files from the database.

#### 3. **Update Folder (Rename)**
   - **Endpoint**: `PUT /folders/:id`
   - **Description**: Renames an existing folder.
   - **Request Body**:
     ```json
     {
       "newName": "NewFolderName"
     }
     ```
   - **Functionality**: Updates the folder name and adjusts the paths of any nested folders or files.
   - **Database Action**: Update the `name` field for the specified folder ID and recursively update paths.

#### 4. **Delete Folder**
   - **Endpoint**: `DELETE /folders/:id`
   - **Description**: Deletes a folder and all its contents (files and subfolders).
   - **Functionality**: Removes the folder and any files associated with it.
   - **Database Action**: Delete the folder entry from the `folders` table, and delete all related entries in the `files` table.

---

### CRUD Operations for Files

#### 1. **Create File (Upload)**
   - **Endpoint**: `POST /files`
   - **Description**: Uploads a file to a specific folder.
   - **Request Body**: Form data with the file and an optional `folderId` to specify the target folder.
   - **Functionality**: Uploads the file and associates it with the specified folder.
   - **Database Action**: Insert a new row in the `files` table with the file’s metadata and path.

#### 2. **Read Files**
   - **Endpoint**: `GET /files`
   - **Description**: Retrieves all files from the database.
   - **Functionality**: Returns a list of all files, optionally filtered by folder if implemented.
   - **Database Action**: Select all files from the `files` table.

#### 3. **Update File (Rename)**
   - **Endpoint**: `PUT /files/:id`
   - **Description**: Renames an existing file.
   - **Request Body**:
     ```json
     {
       "newName": "NewFileName"
     }
     ```
   - **Functionality**: Updates the name of the specified file.
   - **Database Action**: Update the `name` field for the specified file ID.

#### 4. **Delete File**
   - **Endpoint**: `DELETE /files/:id`
   - **Description**: Deletes a file.
   - **Functionality**: Removes the specified file from the database and the file storage.
   - **Database Action**: Delete the file entry from the `files` table.


---

## Styling Notes

The interface provides smooth animations and user-friendly feedback:
- **Action Button**: The action button (⋮) has hover and click effects, transitioning between light and dark gray.
- **Row Interactions**: Folder rows are clickable, with subtle hover and click effects for easy navigation.
- **Modals**: Custom modals (`RenameModal`, `InfoModal`) enhance the UI with clean, organized pop-ups for renaming and viewing details.

---

## Future Improvements

- **Search Functionality**: Add a search bar for quick file and folder access.
- **User Authentication**: Secure access with user login and permissions.
- **Drag and Drop**: Enable drag-and-drop file organization within folders.
- **Pagination**: Implement pagination for large directories to optimize performance.
- **File Previews**: Add file previews for supported types (e.g., images, PDFs).

## GitHub Repo
You can click this link to see the GitHub repo that I worked on below: </br>
https://github.com/JDan0036/file_management 
