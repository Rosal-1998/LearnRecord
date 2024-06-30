<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <TestDemo />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import TestDemo from './components/TestDemo.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    TestDemo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
