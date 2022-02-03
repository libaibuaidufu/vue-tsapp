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
  computed: {
    show() {
      return this.$store.getters.getIsShow;
    },
  },
  methods: {
    goback() {
      if (this.show) {
        this.$store.dispatch("updateIsShow", false);
      } else {
        this.$router.go(-1);
      }
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