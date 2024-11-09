<template>
  <div id="app">
    <h1>File Management System</h1>
    <FileForm />
    <FileList />
  </div>
</template>

<script>
import FileList from './components/FileList.vue';
import FileForm from './components/FileForm.vue';

export default {
  name: 'App',
  components: {
    FileList,
    FileForm,
  },
};
</script>

<style>
/* Add global styling */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
</style>
