<template>
  <!-- <book-re-head :title="title" /> -->
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="book-intro">
      <div class="book-one">
        <div class="book-img">
          <img :src="bookInfo.bookIntro.bookImage" alt="..." v-real-img="" />
        </div>
        <div class="book-info">
          <p class="book-title">{{ bookInfo.bookIntro.bookTitle }}</p>
          <p class="book-title">{{ bookInfo.bookIntro.bookAnchor }}</p>
          <p
            v-if="bookInfo.bookIntro.bookUpdateStatus === 2"
            class="book-title"
          >
            更新到{{ bookInfo.bookIntro.count }}集
          </p>
          <p v-else class="book-title">
            共{{ bookInfo.bookIntro.count }}集已完结
          </p>
          <p v-if="fav" @click="isFav" class="book-title">
            <van-icon name="star" />
          </p>
          <p v-else @click="isFav" class="book-title">
            <van-icon name="star-o" />
          </p>
        </div>
      </div>
      <div class="book-two">
        <p class="book-desc">{{ bookInfo.bookIntro.bookDesc }}</p>
      </div>
      <p>集数</p>
      <p
        class="book-title"
        @click="
          pushToMusic({
            chapterTitle: bookInfo.lastChapterTitle,
            chapterId: bookInfo.lastChapterId,
          })
        "
        v-if="bookInfo.lastChapterTitle"
      >
        上次听到：
        {{ bookInfo.lastChapterTitle }}
      </p>
      <div class="book-listen-list">
        <van-grid clickable :gutter="5">
          <van-grid-item
            :text="(item - 1) * 50 + 1 + '-' + item * 50"
            v-for="item in cutChapter"
            :key="item"
            @click="showCutChapter(item)"
          />
        </van-grid>
        <van-list>
          <van-cell
            v-for="item in cutChapterList"
            :key="item.chapterId"
            :title="item.chapterTitle"
            @click="pushToMusic(item)"
          />
        </van-list>
        <!-- <van-list
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
        </van-list> -->
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import BookFooter from "../components/BookFooter.vue";
import BookReHead from "../components/BookReHead.vue";
import { bookInfo, bookListen, bookRListen } from "../api/book";
import { getFavBookByBookId, getSearchBookByBookId } from "../utils/utils";

export default {
  data() {
    return {
      isLoading: false,
      uid: 0,
      bookIntroList: [],
      size: 20,
      loading: false,
      finished: true,
      fav: false,
      cutChapter: 0,
      cutChapterList: [],
      bookInfo: {
        bookId: 0,
        bookIntro: {},
        lastChapterTitle: "",
        lastChapterId: 0,
        fav: false,
      },
    };
  },
  components: { BookFooter, BookReHead },
  mounted() {},
  created() {
    this.getRouterData();
  },
  methods: {
    onRefresh() {
      this.fetchBookListen(true);
      this.isLoading = false;
      this.$notify({ type: "success", message: "刷新成功" });
    },
    getRouterData() {
      const bookId = parseInt(this.$route.params.id);
      const currentBook = this.$store.getters.getCurrentBook;
      console.log(currentBook, bookId);
      if (currentBook && currentBook.bookId === bookId) {
        this.bookInfo = currentBook;
        this.bookIntroList = this.bookInfo.currentBookListen;
        this.loading = true;
      } else {
        const favList = this.$store.getters.getFavList;
        console.log("bookInfo");
        console.log(bookId);
        console.log(favList);
        const favBook = getFavBookByBookId(favList, bookId);
        console.log(favBook);
        if (favBook === undefined) {
          const searchList = this.$store.getters.getSearchList;
          console.log(searchList);
          const bookIntro = Object.assign(
            {},
            getSearchBookByBookId(searchList, bookId)
          );
          this.bookInfo.bookIntro = bookIntro;
          this.bookInfo.bookId = bookId;
          console.log(this.bookInfo);
          this.fetchBookListen();
        } else {
          this.bookInfo = Object.assign({}, favBook);
          this.bookIntroList = this.bookInfo.currentBookListen;
          this.loading = true;
        }
      }
      this.cutChapter = parseInt(Math.ceil(this.bookIntroList.length / 50));
      this.cutChapterList = this.bookIntroList.slice(0, 50);
      this.fav = this.bookInfo.fav;
    },
    pushToMusic(item) {
      const currentBook = this.$store.getters.getCurrentBook;
      console.log(currentBook, this.bookInfo.bookId);
      // 这个参数是为了控制vuex更新问题 以后再来解决了
      let isBook = false;
      if (
        currentBook &&
        currentBook.bookId &&
        currentBook.bookId === this.bookInfo.bookId
      ) {
        isBook = true;
        this.bookInfo = currentBook;
      }
      console.log(item);
      this.bookInfo.lastChapterTitle = item.chapterTitle;
      this.bookInfo.lastChapterId = item.chapterId;
      console.log(this.bookInfo);
      this.$store.dispatch("updateCurrentBook", this.bookInfo);
      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
      }
      this.$emit("showModule", isBook);
    },
    async fetchBookInfo() {
      const res = await bookInfo({
        uid: this.uid,
        bookId: this.bookInfo.bookId,
      });
      return res.data.data.bookData;
    },
    async fetchBookListen(really = false) {
      const param = {
        bookId: this.bookInfo.bookId,
        uid: this.uid,
        sort: "asc",
        size: this.size,
      };
      let res;
      if (really) {
        res = await bookRListen(param);
      } else {
        res = await bookListen(param);
      }
      this.bookIntroList = res.data.data.list;
      this.loading = true;
      this.bookInfo.bookIntro.count = this.bookIntroList.length;
      this.bookInfo.currentBookListen = this.bookIntroList;
      this.cutChapter = parseInt(Math.ceil(this.bookIntroList.length / 50));
      this.cutChapterList = this.bookIntroList.slice(0, 50);

      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
      }
    },
    showCutChapter(val) {
      const start_chapter = val * 50 - 50;
      const end_chapter = val * 50;
      this.cutChapterList = this.bookIntroList.slice(
        start_chapter,
        end_chapter
      );
    },
    isFav() {
      this.fav = !this.fav;
      this.bookInfo.fav = this.fav;
      console.log(this.bookInfo);
      console.log(this.bookInfo.fav);
      if (this.bookInfo.fav) {
        this.bookInfo.skip_start_time = 0;
        this.bookInfo.skip_end_time = 0;
        this.$store.dispatch("addFav", this.bookInfo);
        console.log(this.$store.getters.getFavList);
      } else {
        this.$store.dispatch("delFav", this.bookInfo.bookId);
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