<template>
  <div class="file-list-container">
    <!-- Check if there are files; if not, show a message -->
    <div v-if="files.length === 0" class="no-files-message">
      There are no files currently in the database. Please add files.
    </div>
    <table v-else class="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th></th> <!-- Placeholder for action icons -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in sortedFiles" :key="file.id">
          <td>{{ file.name }}</td>
          <td>Location/Folder</td> <!-- Placeholder, replace with actual location if available -->
          <td class="actions">
            <button @click="toggleMenu(index)" class="action-button">⋮</button>
            
            <!-- Pop-up menu that appears when the three dots are clicked -->
            <div v-if="activeMenu === index" class="popup-menu">
              <button @click="showFileInfo(file)">File Information</button>
              <button @click="renameFile(file)">Rename</button>
              <button @click="downloadFile(file)">Download</button>
              <button @click="deleteFile(file.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  name: 'FileList',
  props: {
    refreshFlag: Boolean,
  },
  data() {
    return {
      files: [],
      sortOption: 'name',
      errorMessage: '',
      activeMenu: null, // Tracks which menu is active
    };
  },
  computed: {
    sortedFiles() {
      return this.files.slice().sort((a, b) => {
        if (this.sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (this.sortOption === 'date') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    },
  },
  methods: {
    fetchFiles() {
      apiClient.get('/files')
        .then(response => {
          this.files = response.data;
          this.errorMessage = '';
        })
        .catch(error => {
          this.errorMessage = 'Error fetching files: ' + error.message;
          console.error('Error fetching files:', error);
        });
    },
    deleteFile(id) {
      apiClient.delete(`/files/${id}`)
        .then(() => {
          this.files = this.files.filter(file => file.id !== id);
        })
        .catch(error => {
          this.errorMessage = 'Error deleting file: ' + error.message;
          console.error('Error deleting file:', error);
        });
    },
    toggleMenu(index) {
      this.activeMenu = this.activeMenu === index ? null : index;
    },
    showFileInfo(file) {
      alert(`File Information:\nName: ${file.name}\nLocation: Location/Folder`);
    },
    renameFile(file) {
      const newName = prompt('Enter new file name:', file.name);
      if (newName) {
        file.name = newName;
      }
      this.activeMenu = null;
    },
    downloadFile(file) {
      alert(`Downloading ${file.name}...`);
      this.activeMenu = null;
    },
  },
  watch: {
    refreshFlag() {
      this.fetchFiles();
    },
  },
  created() {
    this.fetchFiles();
  },
};
</script>

<style scoped>
.file-list-container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 10%;
  width: 90%; /* Reduced width to fit within viewport */
  height: 90%; /* Maximum width to avoid excessive size */
  max-width: 80%; /* Maximum width to avoid excessive size */
  max-height: 80%; /* Maximum width to avoid excessive size */
  margin: 0 auto; /* Center the container */
  overflow-x: auto; /* Allow horizontal scroll within container if necessary */
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th,
.file-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.file-table th {
  color: #666;
  font-weight: bold;
}

.actions {
  position: relative;
  text-align: right;
}

.action-button {
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
}

.action-button:hover {
  color: #333;
}

/* Popup Menu Styling */
.popup-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 150px;
  z-index: 1000;
}

.popup-menu button {
  display: block;
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #333;
}

.popup-menu button:hover {
  background-color: #f5f5f5;
}

/* Message for no files */
.no-files-message {
  text-align: center;
  font-size: 1.2em;
  color: #888;
  padding: 20px 0;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
