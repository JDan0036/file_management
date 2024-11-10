<template>
  <div class="file-list-container">
    <div v-if="currentFolderId !== null">
      <!-- Back Button to go to the previous directory -->
      <button class="back-button" @click="navigateToPrevious">⬅ Back</button>
    </div>

    <div v-if="!folders.length && !files.length" class="no-files-message">
      There are no files or folders here.
    </div>
    <div v-else class="file-table">
      <table>
        <thead>
          <tr>
            <th>Folder Type</th>
            <th>Name</th>
            <th>Location</th>
            <th>Uploaded At</th>
            <th></th> <!-- Placeholder for action icons -->
          </tr>
        </thead>
        <tbody>
          <!-- Folder rows -->
          <tr v-for="(folder, folderIndex) in folders" :key="'folder-' + folder.id" class="folder-row" @click="navigate(folder.id)">
            <td class="folder-logo"><img :src="require('@/assets/folder.png')" alt="Folder icon" class="folder-logo-image"/></td>
            <td @click="navigate(folder.id)"><i class="fas fa-folder"></i> {{ folder.name }}</td>
            <td>{{ getLocation(folder) }}</td>
            <td>{{ formatDate(folder.createdAt) }}</td>
            <td class="actions">
              <button @click.stop="toggleMenu('folder-' + folderIndex)" class="action-button">⋮</button>
              <div v-if="activeMenu === 'folder-' + folderIndex" class="popup-menu">
                <button @click="showFolderInfo(folder)">Folder Information</button>
                <button @click="renameFolder(folder)">Rename Folder</button>
                <button @click="downloadFolder(folder)">Download Folder</button>
                <button @click="deleteFolder(folder.id)">Delete Folder</button>
              </div>
            </td>
          </tr>
          
          <!-- File rows -->
          <tr v-for="(file, fileIndex) in files" :key="'file-' + file.id" class="file-row">
            <td class="file-logo"><img :src="require('@/assets/file.png')" alt="File icon" class="file-logo-image"/></td> 
            <td>{{ file.name }}</td>
            <td>{{ getLocation(file) }}</td>
            <td>{{ formatDate(file.createdAt) }}</td>
            <td class="actions">
              <button @click.stop="toggleMenu('file-' + fileIndex)" class="action-button">⋮</button>
              <div v-if="activeMenu === 'file-' + fileIndex" class="popup-menu">
                <button @click="showFileInfo(file)">File Information</button>
                <button @click="renameFile(file)">Rename</button>
                <button @click="downloadFile(file)">Download</button>
                <button @click="deleteFile(file.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <RenameModal
      v-if="renameModalVisible"
      :visible="renameModalVisible"
      :itemType="renameItemType"
      :initialName="renameItemName"
      @close="renameModalVisible = false"
      @rename="handleRename"
    />
    <InfoModal
      v-if="infoModalVisible"
      :visible="infoModalVisible"
      :title="modalTitle"
      :content="modalContent"
      @close="infoModalVisible = false"
    />
  </div>
</template>

<script>
import InfoModal from './InfoModal.vue';
import apiClient from '../services/api';
import RenameModal from './RenameModal.vue';

export default {
  name: 'FileList',
  components: {
    InfoModal,
    RenameModal,
  },
  props: {
    refreshFlag: Boolean,
    currentFolderId: Number,
  },
  data() {
    return {
      folders: [],
      files: [],
      errorMessage: '',
      activeMenu: null,
      folderHistory: [], // History stack to keep track of previous folders
      modalTitle: '',
      modalContent: {}, // Content for the info modal
      infoModalVisible: false,
      renameItemType: '', // 'Folder' or 'File'
      renameItemName: '', 
      renameItemId: null, // ID of the item being renamed
      renameModalVisible: false, 
    };
  },
  methods: {
    fetchFoldersAndFiles() {
      apiClient.get('/folders')
        .then(response => {
          const foldersData = response.data.folders || [];
          const rootFiles = response.data.rootFiles || [];
          
          this.folders = foldersData.filter(folder => folder.parentId === this.currentFolderId);
          this.files = this.currentFolderId === null
            ? rootFiles // Show root files when in the root folder
            : foldersData.flatMap(folder => folder.files || []).filter(file => file.folderId === this.currentFolderId);
          
          this.errorMessage = '';
        })
        .catch(error => {
          this.errorMessage = 'Error fetching data: ' + error.message;
        });
    },
    navigate(folderId) {
      // Add the current folder to history before navigating
      if (this.currentFolderId !== null) {
        this.folderHistory.push(this.currentFolderId);
      }
      this.$emit('navigate', folderId); // Emit event to navigate to folder
    },
    navigateToPrevious() {
      // Pop the last folder ID from history and navigate there
      const previousFolderId = this.folderHistory.pop();
      this.$emit('navigate', previousFolderId);
      if (previousFolderId === null){
        this.$emit('navigate', null)
      }
    },
    toggleMenu(menuId) {
      this.activeMenu = this.activeMenu === menuId ? null : menuId;
    },
    handleClickOutside(event) {
      if (!event.target.closest('.action-button') && !event.target.closest('.popup-menu')) {
        this.activeMenu = null;
      }
    },
    showFolderInfo(folder) {
      this.modalTitle = 'Folder Information';
      this.modalContent = {
        Name: folder.name,
        'Created At': this.formatDate(folder.createdAt),
        Location: this.getLocation(folder),
      };
      this.infoModalVisible = true;
      this.activeMenu = null;
    },
    renameFolder(folder) {
      this.renameItemType = 'Folder';
      this.renameItemName = folder.name;
      this.renameItemId = folder.id;
      this.renameModalVisible = true;
    },
    showFileInfo(file) {
      this.modalTitle = 'File Information';
      this.modalContent = {
        Name: file.name,
        'Uploaded At': this.formatDate(file.createdAt),
        Location: this.getLocation(file),
      };
      this.infoModalVisible = true;
      this.activeMenu = null;
    },
    renameFile(file) {
      this.renameItemType = 'File';
      this.renameItemName = file.name;
      this.renameItemId = file.id;
      this.renameModalVisible = true;
    },
    handleRename(newName) {
      const id = this.renameItemId;
      const url = this.renameItemType === 'Folder' ? `/folders/${id}` : `/files/${id}`;

      apiClient
        .put(url, { newName })
        .then(() => {
          if (this.renameItemType === 'Folder') {
            const folder = this.folders.find(f => f.id === id);
            if (folder) folder.name = newName;
          } else {
            const file = this.files.find(f => f.id === id);
            if (file) file.name = newName;
          }
          this.fetchFoldersAndFiles(); // Refresh the list to show updated names
          this.renameModalVisible = false; // Close the modal
        })
        .catch(error => {
          this.errorMessage = `Error renaming ${this.renameItemType.toLowerCase()}: ` + error.message;
        });
    },
    downloadFile(file) {
      apiClient.get(`/files/download/${file.id}`, {
        responseType: 'blob', // Ensure the response is treated as a blob
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name); // Set file name for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        this.errorMessage = 'Error downloading file: ' + error.message;
      });
    },
    // Trigger folder download
    downloadFolder(folder) {
      apiClient.get(`/folders/download/${folder.id}`, {
        responseType: 'blob', // Ensure the response is treated as a blob
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${folder.name}.zip`); // Set folder name as zip for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        this.errorMessage = 'Error downloading folder: ' + error.message;
      });
    },
    deleteFolder(folderId) {
      apiClient.delete(`/folders/${folderId}`).then(() => {
        this.folders = this.folders.filter(f => f.id !== folderId);
        this.files = this.files.filter(file => file.folderId !== folderId);
      }).catch(error => {
        this.errorMessage = 'Error deleting folder: ' + error.message;
      });
    },
    deleteFile(fileId) {
      apiClient.delete(`/files/${fileId}`).then(() => {
        this.files = this.files.filter(file => file.id !== fileId);
      }).catch(error => {
        this.errorMessage = 'Error deleting file: ' + error.message;
      });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return new Date(dateString).toLocaleDateString('en-GB', options).replace(',', '');
    },
    getLocation(folder) {
      return folder.path || 'Root';
    },
  },
  watch: {
    refreshFlag() {
      this.fetchFoldersAndFiles();
    },
    currentFolderId() {
      this.fetchFoldersAndFiles();
    },
  },
  created() {
    this.fetchFoldersAndFiles();
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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
  top: 13%;
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

/* Styling for headers */
.file-table th {
  font-weight: bold;
}

.file-row, .folder-row {
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.folder-row {
  cursor: pointer;
}

.file-row {
  cursor: default;
}

/* Hover effect for all rows */
.folder-row:hover, .file-row:hover {
  background-color: #f9f9f9; /* Light gray background on hover */
}

/* Active click effect for folder rows */
.folder-row:active {
  background-color: #e0e0e0; /* Darker gray background on click for folders */
}

/* File row hover effect mimicking the action button style */
.file-row:hover {
  background-color: #f5f5f5; /* Subtle gray hover for file rows */
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
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
}

.action-button:hover {
  background-color: #f0f0f0; /* Light gray background on hover */
  color: #333; /* Darker text on hover */
}

.action-button:active {
  background-color: #d0d0d0; /* Darker gray on click */
  color: #000; /* Even darker text on click */
  transform: scale(0.95); /* Slightly shrink button on click for visual feedback */
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

.back-button {
  background-color: #d9d9d9; /* Grey background */
  color: black; /* Change text color to black for better contrast */
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

.back-button:hover {
  background-color: #b3b3b3; /* Darker grey for hover effect */
}

.folder-logo-image {
  width: 40px; 
  height: auto;
  aspect-ratio: 1 / 1; /* Maintain a 1:1 aspect ratio */
  object-fit: contain; /* Ensure the image fits within the container without distortion */
}

.folder-logo {
  align-items: center; 
}

.file-logo-image {
  width: 40px; 
  height: auto;
  aspect-ratio: 1 / 1; /* Maintain a 1:1 aspect ratio */
  object-fit: contain; /* Ensure the image fits within the container without distortion */
}

.file-logo {
  align-items: center; 
}

</style>
