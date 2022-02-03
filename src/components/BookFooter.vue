<template>
  <div class="foot">
    <van-tabbar v-model="active_" >
      <van-tabbar-item name='BookSearch' icon="search">搜索</van-tabbar-item>
      <van-tabbar-item name='PlayMusic' icon="pause-circle-o" @click="changeShow" v-if="show"></van-tabbar-item>
      <van-tabbar-item name='PlayMusic' icon="play-circle-o" @click="changeShow" v-else></van-tabbar-item>
      <van-tabbar-item name='AddOne' icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "BookFooter",
  data() {
    return {
    };
  },
  props: {
    active: {
      type: String,
      default: "BookSearch",
    },
  },
  computed: {
    show(){
        return this.$store.getters.getIsPlay;
    },
    active_: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("toggleClick", val);
      },
    },
  },
  methods: {
    changeShow(){
      // this.show = !this.show
      this.$emit("changeShow")
    }
  },
};
</script>

<style>
</style>