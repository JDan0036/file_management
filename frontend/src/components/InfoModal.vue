<!-- InfoModal.vue -->
<template>
  <div class="modal-overlay" v-if="visible" @click.self="close">
    <div class="modal-card">
      <h3 class="modal-title">{{ title }}</h3>
      <div class="modal-content">
        <p v-for="(value, key) in content" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </p>
      </div>
      <button class="modal-close-button" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    content: Object,
  },
  methods: {
    close() {
      this.$emit('close');
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
  background: rgb(233, 233, 233);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
    padding-top: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.modal-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
}

.modal-content p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95em;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  padding-top: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  border-style: solid 1px;
}

.modal-close-button {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.modal-close-button:hover {
  background-color: #357ae8;
}
</style>
