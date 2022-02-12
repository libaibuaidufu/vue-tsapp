<template>
  <div class="head">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "BookHeader",
  data() {
    return {
      value:""
    }
  },
  methods: {
    onSearch(val) {
      this.$emit("on-search", val);
    },
    onCancel() {
      // console.log("取消")
    },
  },
};
</script>

<style>
</style>