<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    window.callJsFunction = this.goback;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>