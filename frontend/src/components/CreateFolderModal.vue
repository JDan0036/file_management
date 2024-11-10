<!-- CreateFolderModal.vue -->
<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-card">
        <h3 class="modal-title">Create New Folder</h3>
        <form @submit.prevent="handleCreate">
          <label for="folderName">Folder Name:</label>
          <input
            type="text"
            id="folderName"
            v-model="folderName"
            required
            placeholder="Enter folder name"
          />
          <div class="modal-actions">
            <button type="submit" class="create-button">Create</button>
            <button type="button" class="cancel-button" @click="close">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: Boolean,
    },
    data() {
      return {
        folderName: "",
      };
    },
    methods: {
      handleCreate() {
        if (this.folderName.trim()) {
          this.$emit("create", this.folderName.trim());
          this.folderName = ""; // Reset the input
          this.$emit("close");
        }
      },
      close() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
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
    z-index: 1000;
  }
  
  .modal-card {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  .modal-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-size: 1em;
  }
  
  input[type="text"] {
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1em;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .create-button,
  .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
  }
  
  .create-button {
    background-color: #4285f4;
    color: white;
    margin-right: 10px;
  }
  
  .create-button:hover {
    background-color: #357ae8;
  }
  
  .cancel-button {
    background-color: #ccc;
    color: black;
  }
  
  .cancel-button:hover {
    background-color: #b3b3b3;
  }
  </style>
  