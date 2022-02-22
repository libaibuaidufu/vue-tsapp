<template>
  <div class="book-list">
    <div v-for="item in favList" :key="item.bookId" @click="pushToInfo(item)">
      <div class="book-image">
        <img :src="item.bookIntro.bookImage" alt="..." v-real-img="" />
      </div>
      <div class="book-info">
        <p class="book-title">书名：{{ item.bookIntro.bookTitle }}</p>
        <p class="book-desc">作者：{{ item.bookIntro.bookAnchor }}</p>
        <p class="book-desc">集数：{{ item.bookIntro.count }}</p>
        <p class="book-desc">听到：{{ item.lastChapterTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    favList() {
      return this.$store.getters.getFavList;
    },
  },
  methods: {
    pushToInfo(item) {
      // console.log(item);
      this.$router.push({
        name: `BookInfo`,
        params: {
          id: item.bookId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.book-list {
  padding: 0% 2.5%;
  div {
    margin-bottom: 10px;
    height: 120px;
    display: flex;
    align-items: center;
    .book-image {
      margin-bottom: 0px;
      img {
        width: 30%;
        margin-right: 20px;
        width: 120px;
        height: 120px;
      }
    }

    .book-info {
      width: 62%;
      display: flex;
      flex-flow: row wrap;
      p {
        margin: 0;
      }
      .book-title {
        width: 100%;
      }
      .book-desc {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>