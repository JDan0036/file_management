<template>
  <div>
    <h2>File List</h2>
    <ul>
      <li v-for="file in files" :key="file.id">
        {{ file.name }}
        <button @click="deleteFile(file.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  name: 'FileList',
  data() {
    return {
      files: [],
    };
  },
  methods: {
    fetchFiles() {
      apiClient.get('/files')
        .then(response => {
          this.files = response.data;
        })
        .catch(error => {
          console.error('Error fetching files:', error);
        });
    },
    deleteFile(id) {
      apiClient.delete(`/files/${id}`)
        .then(() => {
          this.files = this.files.filter(file => file.id !== id);
        })
        .catch(error => {
          console.error('Error deleting file:', error);
        });
    },
  },
  created() {
    this.fetchFiles();
  },
};
</script>

<style scoped>
/* Add basic styling */
button {
  margin-left: 10px;
}
</style>
