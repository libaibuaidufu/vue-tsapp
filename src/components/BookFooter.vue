<template>
  <div class="foot">
    <van-tabbar v-model="active_" >
      <van-tabbar-item name='BookSearch' icon="search">搜索</van-tabbar-item>
      <van-tabbar-item name='AddOne' icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "BookFooter",
  data() {
    return {};
  },
  props: {
    active: {
      type: String,
      default: "BookSearch",
    },
  },
  computed: {
    active_: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("toggleClick", val);
      },
    },
  },
};
</script>

<style>
</style>