<template>
  <div class="modal-overlay" v-if="visible" @click.self="close">
    <div class="modal-card">
      <h3 class="modal-title">Rename {{ itemType }}</h3>
      <input
        type="text"
        v-model="newName"
        class="modal-input"
        placeholder="Enter new name"
      />
      <div class="modal-actions">
        <button @click="close" class="modal-button cancel-button">Cancel</button>
        <button @click="submit" class="modal-button rename-button">Rename</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    itemType: String, // 'Folder' or 'File'
    initialName: String,
  },
  data() {
    return {
      newName: this.initialName,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      if (this.newName && this.newName.trim()) {
        this.$emit('rename', this.newName.trim());
      }
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
  text-align: center;
}

.modal-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
}

.modal-input {
  width: 100%;
  max-width: 95%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.cancel-button {
  background-color: #ccc;
}

.rename-button {
  background-color: #4285f4;
  color: white;
}

.rename-button:hover {
  background-color: #357ae8;
}
</style>
