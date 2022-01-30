<template>
  <div class="head">
    <van-nav-bar
      :title="title"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="isReturn"
    />
    <van-nav-bar
      :title="title"
      v-else
    />
  </div>
</template>

<script>
export default {
  name: "BookHeader",
  data() {
    return {
    };
  },
  props:{
      title:{
          type:String,
          require:true
      },
      isReturn:{
        type:Boolean,
        default:false
      }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
      console.log("val");
    },
    onClickRight() {
      console.log("取消");
    },
  },
};
</script>

<style>
</style>