<template>
  <div class="upload-container">
    <form @submit.prevent="uploadFile">
      <label class="upload-button">
        <input type="file" @change="onFileChange" hidden />
        <span>+ New</span>
      </label>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  name: 'FileForm',
  data() {
    return {
      selectedFile: null,
      errorMessage: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.uploadFile(); // Trigger upload immediately after selecting a file
      }
    },
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
        this.$emit('file-uploaded');
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

<style scoped>
.upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-button {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: bold;
}

.upload-button:hover {
  background-color: #357ae8;
}

.error {
  color: red;
}
</style>