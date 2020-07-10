<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    //横竖屏

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 640px;
  margin: 0 auto;
  background-color: #f3f3f3;
  width: 100%;
  height: 100%;
}
  *{
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }
</style>
