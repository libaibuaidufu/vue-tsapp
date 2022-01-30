<template>
  <!-- <book-re-head :title="title" /> -->
  <div class="book-intro">
    <div class="book-one">
      <div class="book-img">
        <img :src="bookIntro.bookImage" alt="..." v-real-img="" />
      </div>
      <div class="book-info">
        <p class="book-title">{{ bookIntro.bookTitle }}</p>
        <p class="book-title">{{ bookIntro.bookAnchor }}</p>
        <p v-if="bookIntro.bookUpdateStatus === 2" class="book-title">
          更新到{{ bookIntro.count }}集
        </p>
        <p v-else class="book-title">共{{ bookIntro.count }}集已完结</p>
        <p v-if="fav" @click="isFav" class="book-title">
          <van-icon name="star" />
        </p>
        <p v-else @click="isFav" class="book-title">
          <van-icon name="star-o" />
        </p>
      </div>
    </div>
    <div class="book-two">
      <p class="book-desc">{{ bookIntro.bookDesc }}</p>
    </div>
    <p>集数</p>
    <p
      class="book-title"
      @click="pushToMusic(favDict.bookChapter)"
      v-if="favDict.bookChapter.chapterTitle"
    >
      上次听到：
      {{ this.favDict.bookChapter.chapterTitle }}
    </p>
    <div class="book-listen-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <van-cell
          v-for="item in bookIntroList"
          :key="item.chapterId"
          :title="item.chapterTitle"
          @click="pushToMusic(item)"
        />
      </van-list>
    </div>
  </div>
</template>

<script>
import BookFooter from "../components/BookFooter.vue";
import BookReHead from "../components/BookReHead.vue";
import { bookInfo, bookListen } from "../api/book";
import {
  loadFavList,
  setFavList,
  getFav,
  isFav,
  removeFavSetFavList,
  pushFavSetFavList,
  saveCurrentBook,
  loadCurrentBook,
} from "../utils/utils";

export default {
  data() {
    return {
      uid: 0,
      bookId: 0,
      bookIntro: {},
      bookIntroList: [],
      size: 20,
      loading: false,
      finished: true,
      fav: false,
      favDict: {
        bookId: 0,
        bookIntro: Object,
        bookChapter: { chapterTitle: null },
      },
    };
  },
  components: { BookFooter, BookReHead },
  mounted() {},
  created() {
    this.getRouterData();
  },
  methods: {
    getRouterData() {
      this.bookId = this.$route.query.id;
      this.bookIntro = this.$route.query.bookIntro;
      if (this.bookIntro instanceof Object) {
        saveCurrentBook(this.bookIntro)
      } else {
        this.bookIntro = loadCurrentBook()
      }
      console.log(this.$route);
      console.log(this.bookId, this.bookIntro);
      this.fav = isFav(this.bookId);
      this.favDict = getFav(this.bookId, {
        bookId: this.bookId,
        bookIntro: this.bookIntro,
        bookChapter: { chapterTitle: null },
      });
      this.fetchBookListen();
    },
    pushToMusic(item) {
      this.favDict.bookChapter = item;
      if (this.fav) {
        removeFavSetFavList(this.bookId, this.favDict);
      }
      this.$router.push({
        name: `PlayMusic`,
        params: {
          bookId: this.bookId,
          chapterId: item.chapterId,
          chapterTitle: item.chapterTitle,
          bookIntro: this.bookIntro,
          bookIntroList: this.bookIntroList,
          bookChapter: item,
        },
      });
    },
    async fetchBookInfo() {
      const res = await bookInfo({ uid: this.uid, bookId: this.bookId });
      // this.bookIntro = res.data.data.bookData;
      return  res.data.data.bookData
    },
    async fetchBookListen() {
      const res = await bookListen({
        bookId: this.bookId,
        uid: this.uid,
        sort: "asc",
        size: this.size,
      });
      this.bookIntroList = res.data.data.list;
      this.loading = true;
      this.favDict.bookIntro.count = this.bookIntroList.length;
      if (this.fav) {
        removeFavSetFavList(this.bookId, this.favDict);
      }
    },
    isFav() {
      this.fav = !this.fav;
      if (this.fav) {
        pushFavSetFavList(this.favDict);
      } else {
        removeFavSetFavList(this.bookId, {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.book-intro {
  padding: 0px 2.5% 0 2.5%;
  .book-one {
    padding-bottom: 10px;
    height: 120px;
    display: flex;
    align-items: center;
    overflow: hidden;
    .book-img {
      width: 50%;
      margin-right: 20px;
      img {
        width: 100%;
      }
    }
    .book-info {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      overflow: hidden;
      height: 100%;
      align-items: center;

      .book-title {
        width: 100%;
        margin: 0;
      }
      .book-desc {
        width: 100%;
      }
    }
  }
  .book-two {
    text-indent: 2em;
  }
  .book-listen-list {
    display: flex;
    align-items: center;
    align-content: flex-start;
    flex-flow: row wrap;
    .book-number {
      text-align: center;
      width: 21.9%;
      border: 1px solid burlywood;
      margin-bottom: 5px;
      &:nth-child(4n + 1) {
        margin-left: 2%;
      }
      &:nth-child(4n + 2) {
        margin-left: 2%;
        margin-right: 2%;
      }
      &:nth-child(4n) {
        margin-left: 2%;
        margin-right: 2%;
      }
    }
  }
}
</style>