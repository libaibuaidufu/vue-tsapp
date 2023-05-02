<template>
  <div class="book-list">
    <div v-for="item in searchBook" :key="item.id" @click="pushToInfo(item)">
      <img :src="item.bookImage" alt="..." v-real-img=""  />
      <p class="title">{{ item.bookTitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    searchBook: {
      typeof: Object,
      default: [],
    },
  },
  methods: {
    pushToInfo(item) {
      this.$router.push({
        name: `BookInfo`,
        params: {
          id: item.id,
          // bookIntro: item,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.book-list {
  text-align: center;
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  align-items: center;

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  div {
    width: 30%;
    &:nth-child(3n + 1) {
      padding-left: 2.5%;
    }
    &:nth-child(2n) {
      padding-left: 2.5%;
      padding-right: 2.5%;
    }
    &:nth-child(3n) {
      padding-right: 2.5%;
    }
    img {
      width: 100%;
      width: 120px;
      height: 120px;
    }
  }
}
</style>
