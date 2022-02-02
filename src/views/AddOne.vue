<template>
  <div class="book-list">
    <div v-for="item in favList" :key="item.bookId" @click="pushToInfo(item)">
      <div>
      <img :src="item.bookIntro.bookImage" alt="..." v-real-img="" />

      </div>
      <div class="book-info">
        <p class="book-title">书名：{{ item.bookIntro.bookTitle }}</p>
        <p class="book-desc">作者：{{ item.bookIntro.bookAnchor }}</p>
        <p class="book-desc">集数：{{ item.bookIntro.count }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {loadFavList} from '../utils/utils'
export default {
  data() {
    return {
      favList: [],
    };
  },
  mounted() {
    this.favList = this.$store.getters.getFavList;
  },
  methods: {
    pushToInfo(item) {
      this.$router.push({
        name: `BookInfo`,
        query: {
          id: item.bookId
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
    padding-bottom: 10px;
    height: 120px;
    display: flex;
    align-items: center;
    img {
      width: 30%;
      margin-right: 20px;
      width: 120px;
      height: 120px;
    }
    .book-info {
      width: 100%;
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
      }
    }
  }
}
</style>