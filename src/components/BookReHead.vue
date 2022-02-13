<template>
  <div class="head">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-if="isReturn"
    />
    <van-nav-bar
      right-text="设置"
      @click-right="onClickRight"
      :title="title"
      v-else
    />
  </div>
</template>

<script>
export default {
  name: "BookHeader",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      require: true,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
      // console.log("val");
    },
    onClickRight() {
        this.$store.dispatch("updateIsSettings", true);
      // this.$store.dispatch("updateFavList",[])
      // this.$store.dispatch("updateCurrentBook",{})
      // resetCache()
      // this.$emit("resetCache")
    },
  },
};
</script>

<style>
</style>