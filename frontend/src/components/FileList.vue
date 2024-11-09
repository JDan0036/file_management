<template>
  <div>
    <h2>File List</h2>

    <!-- Sorting Dropdown -->
    <div>
      <label for="sort">Sort by: </label>
      <select v-model="sortOption" @change="sortFiles">
        <option value="name">Name</option>
        <option value="date">Date</option>
      </select>
    </div>

    <!-- File in a list format -->
    <ul>
      <li v-for="file in sortedFiles" :key="file.id">
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
  props: {
    refreshFlag: Boolean,
  },
  data() {
    return {
      files: [],
      sortOption: 'name', // Default sorting option
    };
  },
  computed: {
    sortedFiles() {
      // Sort files based on the selected sortOption
      return this.files.slice().sort((a, b) => {
        if (this.sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (this.sortOption === 'date') {
          return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        }
      });
    },
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
    sortFiles() {
      // Trigger re-computation of sortedFiles when sortOption changes
      this.sortedFiles;
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
button {
  margin-left: 10px;
}
</style>
