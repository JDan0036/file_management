<template>
  <div id="app">
    <h1>File Management System</h1>
    <FileForm @file-uploaded="refreshFileList" />
    <FileList :refreshFlag="refreshFlag" />
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
  data() {
    return {
      refreshFlag: false,
    };
  },
  methods: {
    refreshFileList() {
      this.refreshFlag = !this.refreshFlag;
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
</style>
