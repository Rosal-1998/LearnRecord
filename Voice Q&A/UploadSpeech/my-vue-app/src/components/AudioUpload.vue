<template>
  <div>
    <h1>Upload Audio File</h1>
    <form @submit.prevent="uploadFile">
      <input type="file" ref="audioFile" accept="audio/*" required>
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    uploadFile() {
      const formData = new FormData();
      formData.append('audioFile', this.$refs.audioFile.files[0]);

      axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        alert('File uploaded successfully');
      })
      .catch(error => {
        alert('File upload failed: ' + error.message);
      });
    }
  }
}
</script>
