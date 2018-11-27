<template>
  <div id="app">
      <router-view></router-view>
  <!--  <flyPage>
        <div slot="fixed" style="position:fixed;top:0;width: 100%;background: red;height: 1rem;"></div>
        <div style="height: 1000px;background: aqua"></div>
    </flyPage>-->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
div{
    -webkit-overflow-scrolling: touch;
}
</style>
