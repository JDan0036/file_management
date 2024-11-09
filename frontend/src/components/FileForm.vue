<template>
  <div>
    <h2>Upload a File</h2>
    <form @submit.prevent="uploadFile">
      <input type="file" @change="onFileChange" />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  name: 'FileForm',
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert('Please select a file.');
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
        alert('File uploaded successfully!');
        this.selectedFile = null; // Clear file selection after upload
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    },
  },
};
</script>

<style scoped>
/* Add basic styling */
button {
  margin-top: 10px;
}
</style>
