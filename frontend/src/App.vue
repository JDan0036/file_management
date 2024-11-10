<template>
  <div id="app">
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img :src="require('@/assets/company logo light mode.png')" alt="A Serious Company Logo" class="company-logo"/>
          <span>A SERIOUS COMPANY</span>
        </div>
        <!-- New Button opens modal for creating folders or uploading files -->
        <button class="sidebar-button" @click="showNewModal = true">+ New</button>
        <nav class="sidebar-nav">
          <button class="sidebar-link" @click="navigateToRoot">My Files</button>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="content">
        <h2>File Management</h2>
        <h3>Files</h3>
        <FileList :currentFolderId="currentFolderId" :refreshFlag="refreshFlag" @navigate="navigateToFolder" />
      </main>
    </div>

    <!-- New Modal for folder and file options -->
    <div v-if="showNewModal" class="modal-overlay" @click.self="showNewModal = false">
      <div class="modal-content">
        <h3>Create New</h3>
        <button class="modal-link" @click="openCreateFolder">Create a New Folder</button>
        <button class="modal-link" @click="triggerFileInput">Upload a New File</button>
        <button class="modal-link" @click="showNewModal = false">Close</button>
      </div>
    </div>

    <!-- Hidden file input for file upload -->
    <input type="file" ref="fileInput" @change="handleFileUpload" hidden />
  </div>
</template>

<script>
import FileList from './components/FileList.vue';
import apiClient from './services/api';

export default {
  name: 'App',
  components: {
    FileList,
  },
  data() {
    return {
      refreshFlag: false,
      selectedFile: null,
      showNewModal: false,
      errorMessage: '',
      currentFolderId: null, // Track current folder; null means root
    };
  },
  methods: {
    // Triggers the hidden file input when "New" button is clicked
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // Navigate to the root folder
    navigateToRoot() {
      this.currentFolderId = null; // Reset to root
      this.refreshFlag = !this.refreshFlag;
    },
    // Navigate to a specific folder by setting currentFolderId
    navigateToFolder(folderId) {
      console.log(folderId)
      if (folderId === undefined){
        this.navigateToRoot()
        return
      }
      this.currentFolderId = folderId;
      this.refreshFlag = !this.refreshFlag;
    },
    // Opens modal to create a folder
    openCreateFolder() {
      const folderName = prompt("Enter folder name:");
      if (folderName) {
        this.createFolder(folderName);
      }
    },
    // Create folder request to the backend
    createFolder(folderName) {
      apiClient.post('/folders', { name: folderName, parentId: this.currentFolderId })
        .then(() => {
          this.refreshFlag = !this.refreshFlag;
          this.showNewModal = false;
        })
        .catch(error => {
          this.errorMessage = 'Error creating folder: ' + error.message;
        });
    },
    // Handles file upload after file selection
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.uploadFile(this.currentFolderId);
      }
    },
    // Uploads the selected file to the specified folder
    uploadFile(folderId) {
      if (!this.selectedFile) {
        this.errorMessage = 'Please select a file.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      if (folderId !== null) {
        formData.append('folderId', folderId);
      }

      apiClient.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        this.refreshFlag = !this.refreshFlag;
        this.selectedFile = null;
        this.showNewModal = false;
        this.errorMessage = '';
      })
      .catch(error => {
        this.errorMessage = 'Error uploading file: ' + error.message;
      });
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f6fa;
  margin: 0;
}

#app {
  display: flex;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #d3d3d3;
}

.sidebar-button {
  background-color: #4285f4;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  padding-left: 20px;
}

.sidebar-button:hover {
  background-color: #357ae8;
}

.sidebar-nav {
  width: 100%;
}

.sidebar-link {
  background: none;
  border: none;
  color: #333;
  padding: 10px 20px;
  text-align: left;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sidebar-link:hover {
  background-color: #d0d0d0;
}

.logo {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 30px;
}

.company-logo {
  width: 200px; 
  height: auto; 
  aspect-ratio: 95 / 28; /* Maintain a 95:28 aspect ratio */
  object-fit: contain; /* Ensure the image fits within the container without distortion */
}

.logo span {
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
}

.content {
  flex: 1;
  padding: 20px;
}

h2 {
  font-size: 1.5em;
  color: #333;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-content button {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.modal-link {
  background: none;
  border: none;
  color: #333;
  padding: 10px 20px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.modal-link:hover {
  background-color: #d0d0d0;
}
</style>
