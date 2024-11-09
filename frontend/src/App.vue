<template>
  <div id="app">
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img :src="require('@/assets/company logo light mode.png')" alt="A Serious Company Logo" class="company-logo"/>
          <span>A SERIOUS COMPANY</span>
        </div>
        <!-- New Button triggers file input -->
        <button class="sidebar-button" @click="triggerFileInput">+ New</button>
        <nav class="sidebar-nav">
          <button class="sidebar-link">My Files</button>
          <button class="sidebar-link">Trash</button>
        </nav>
        <!-- Hidden file input for uploading files -->
        <input type="file" ref="fileInput" @change="handleFileUpload" hidden />
      </aside>

      <!-- Main Content Area -->
      <main class="content">
        <h2>Recent Files</h2>
        <FileList :refreshFlag="refreshFlag" />
      </main>
    </div>
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
      errorMessage: '',
    };
  },
  methods: {
    // Triggers the hidden file input when "New" button is clicked
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // Handles the file selection and upload
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.uploadFile();
      }
    },
    // Uploads the selected file to the backend
    uploadFile() {
      if (!this.selectedFile) {
        this.errorMessage = 'Please select a file.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      apiClient.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        this.refreshFlag = !this.refreshFlag; // Trigger refresh in FileList
        this.selectedFile = null;
        this.errorMessage = '';
      })
      .catch(error => {
        this.errorMessage = 'Error uploading file: ' + error.message;
        console.error('Error uploading file:', error);
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
  text-align: left;
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

.content {
  flex: 1;
  padding: 20px;
}

h2 {
  font-size: 1.5em;
  color: #333;
}
</style>
