<template>
  <div class="container">
    <video
      ref="video"
      class="video"
      @canplay="musicCanPlay"
      @timeupdate="onTimeupdate"
      @ended="musicEnd"
      v-if="refresh"
    >
      <source :src="url" type="video/mp4" />
    </video>
    <book-header
      @on-search="bookSearch"
      v-if="
        this.$route.name === 'BookSearch' && this.$route.name !== 'PlayMusic'
      "
    />
    <book-re-head
      :title="title"
      :isReturn="isReturn"
      @resetCache="resetCache"
      v-else-if="this.$route.name !== 'PlayMusic'"
    />
    <div
      v-bind:class="{
        content: this.$route.name !== 'PlayMusic',
        playContent: this.$route.name === 'PlayMusic',
      }"
    >
      <router-view
        :key="key"
        :searchBook="searchBook"
        @showModule="getRouteData"
      />
    </div>
    <book-footer
      :active="tab_active"
      @toggleClick="toggleClick"
      @changeShow="getRouteData"
      v-if="this.$route.name !== 'PlayMusic'"
    />
    <div class="music-skip">
      <!-- <p @click="isShow = true">跳过头尾</p> -->
      <!-- <p @click="isRate = true">播放速度X{{ rate_play }}</p> -->
      <!-- <p @click="isChapter = true" v-if="skip_chapter === 0">
                  定时关闭
                </p>
                <p @click="isChapter = true" v-else>剩余{{ skip_chapter }}集</p> -->
      <!-- <p @click="isList = true">集数列表</p> -->
      <van-action-sheet
        v-model="isShow"
        title="跳过头尾"
        cancel-text="确定"
        :closeable="false"
        @closed="cancelSkipTime"
        @cancel="saveSkipTime"
        @select="onSelectShow"
      >
        <div class="slider">
          <div class="slider-tab">
            <p>跳过开头</p>
            <van-stepper
              v-model="bookInfo.skip_start_time"
              min="0"
              max="120"
              name="跳过开头"
              integer
            />
          </div>
          <div class="slider-tab">
            <p>跳过结尾</p>
            <van-stepper
              v-model="bookInfo.skip_end_time"
              min="0"
              max="120"
              name="跳过结尾："
              integer
            />
          </div>
        </div>
      </van-action-sheet>
      <van-action-sheet
        v-model="isRate"
        :actions="rate_option"
        title="播放速度"
        @select="onSelectRate"
      />
      <van-action-sheet
        v-model="isChapter"
        :actions="skip_options"
        title="定时关闭"
        @select="onSelectChapter"
      />
      <van-action-sheet
        v-model="isList"
        title="集数列表"
        @select="onSelectChapterOptions"
      >
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
            @click="playClickChapter(item)"
          />
        </van-list>
      </van-action-sheet>
    </div>
    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <div class="music-back">
          <!-- <div  class="down"><van-icon name="down" /></div> -->
          <div class="music-play">
            <!-- <div class="music-return">
              <van-icon name="shrink" @click="onClickLeft" size="2rem" />
            </div> -->
            <van-nav-bar
              left-arrow
              @click-left="onClickLeft"
              class="music-return"
            />
            <div class="music-img">
              <img :src="bookInfo.bookIntro.bookImage" alt="" />
              <div class="book-info">
                <p>{{ bookInfo.bookIntro.bookTitle }}</p>
                <p>{{ bookInfo.bookIntro.bookAnchor }}</p>
                <p>{{ bookInfo.lastChapterTitle }}</p>
              </div>
            </div>
            <div class="music-control">
              <div class="music-icon">
                <van-icon name="ellipsis" @click="isShow = true" />
                <van-icon name="add-o" @click="isRate = true" :badge="rate_play" v-if="rate_play !==1" />
                <van-icon name="add-o" @click="isRate = true"  v-else />
                <van-icon name="clock-o" @click="isChapter = true" :badge="skip_chapter" v-if="skip_chapter!==0" />
                <van-icon name="clock-o" @click="isChapter = true"  v-else />
                <van-icon name="setting-o" @click="isList = true" />
              </div>
              <div class="music-progress">
                <div class="run-time">{{ run_time }}</div>
                <div class="music-pro">
                  <van-slider v-model="percentage" @change="onChange" />
                </div>
                <div class="end-time">{{ end_time }}</div>
              </div>
              <div class="music-plays">
                <p @click="addTime(-10)">-10s</p>
                <van-icon name="arrow-left" @click="lastMusic" />
                <van-icon name="play" v-if="!is_play" @click="playMusic" />
                <van-icon name="pause" @click="playMusic" v-else />
                <van-icon name="arrow" @click="nextMusic" />
                <p @click="addTime(10)">+10s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import BookFooter from "../components/BookFooter.vue";
import BookHeader from "../components/BookHeader.vue";
import BookReHead from "../components/BookReHead.vue";
import { bookSearch, bookOne } from "../api/book";
import { abc, realFormatSecond } from "../utils/utils";

export default {
  components: { BookHeader, BookFooter, BookReHead },
  name: "Home",
  data() {
    return {
      tab_active: "BookSearch",
      loading: false,
      finished: false,
      searchBook: [],
      keyword: "",
      page: 20,

      rate_play: 1,
      rate_option: [
        {
          name: "x1",
          value: 1,
        },
        {
          name: "x1.25",
          value: 1.25,
        },
        {
          name: "x1.5",
          value: 1.5,
        },
        {
          name: "x1.75",
          value: 1.75,
        },
        {
          name: "x2",
          value: 2,
        },
      ],
      skip_chapter: 0,
      skip_options: [
        {
          name: "一集",
          value: 1,
        },
        {
          name: "二集",
          value: 2,
        },
        {
          name: "三集",
          value: 3,
        },
        {
          name: "四集",
          value: 4,
        },
        {
          name: "五集",
          value: 5,
        },
        {
          name: "关闭",
          value: 0,
        },
      ],
      isShow: false,
      isRate: false,
      isChapter: false,
      isList: false,
      chapterOptions: [],

      end_time: "0:00:00",
      run_time: "0:00:00",
      percentage: 0,
      skip_start_time: 0,
      skip_end_time: 0,

      url: "",
      bookImage: "",
      bookId: 0,
      refresh: true,
      bookIntroList: [],
      bookInfo: {
        lastChapterTitle: "",
        lastChapterId: 0,
        skip_start_time: 0,
        skip_end_time: 0,
        bookIntro: {
          bookImage: "",
          bookTitle: "",
        },
      },

      auto_load: true,
      close_status: false,
      is_play: false,
      is_can_play: false,
      cutChapter: 0,
      cutChapterList: [],
    };
  },
  computed: {
    show: {
      get() {
        return this.$store.getters.getIsShow;
      },
      set(val) {
        this.$store.dispatch("updateIsShow", val);
      },
    },
    key() {
      this.tab_active = this.$route.name;
      try {
        window.androidinfo.saveCurrentPath(this.$route.name);
      } catch (err) {
        console.log("web运行");
      }
      return this.$route.path;
    },
    title() {
      return this.$route.meta.title;
    },
    isReturn() {
      return this.$route.meta.isReturn;
    },
  },
  watch: {
    url() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
    is_play(val) {
      this.is_play = val;
      this.$store.dispatch("updateIsPlay", val);
    },
    show(val) {
      this.show = val;
    },
  },
  methods: {
    bookUpdateFavCurrent() {
      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
      }
      this.$store.dispatch("updateCurrentBook", this.bookInfo);
    },
    async bookSearch(val) {
      this.keyword = val;
      const params = {
        search: this.keyword,
      };
      const res = await bookSearch(params);
      this.$store.dispatch("setSearchList", res.data.data.bookData);
      this.searchBook = res.data.data.bookData;
    },
    toggleClick(val) {
      this.tab_active = val;
      if (val !== "PlayMusic") {
        this.$router.push({
          name: val,
        });
      }
    },
    saveSkipTime() {
      console.log("in")
      this.skip_start_time = this.bookInfo.skip_start_time;
      this.skip_end_time = this.bookInfo.skip_end_time;
      this.bookUpdateFavCurrent();
    },
    cancelSkipTime() {
      this.bookInfo.skip_start_time = this.skip_start_time;
      this.bookInfo.skip_end_time = this.skip_end_time;
    },
    getRouteData(isBook=false) {
      console.log(this.bookInfo)
      // const bookInfo = Object.assign({}, this.$store.getters.getCurrentBook);
      const bookInfo = this.$store.getters.getCurrentBook;
      console.log(bookInfo.lastChapterId, this.bookInfo.lastChapterId)
      console.log(this.bookInfo)
      if (bookInfo.bookId) {
        if (
          bookInfo.bookId !== this.bookId ||
          bookInfo.lastChapterId != this.bookInfo.lastChapterId || isBook
        ) {
          if (this.is_play) {
            console.log("暂停了在播放");
            this.playMusic();
          }
          this.show = true;
          this.bookInfo = bookInfo;
          this.bookId = this.bookInfo.bookId;
          this.bookImage = this.bookInfo.bookIntro.bookImage;
          this.bookIntroList = this.bookInfo.currentBookListen;
          this.skip_start_time = this.bookInfo.skip_start_time;
          this.skip_end_time = this.bookInfo.skip_end_time;
          this.cutChapter = parseInt(Math.ceil(this.bookIntroList.length / 50));
          this.cutChapterList = this.bookIntroList.slice(0, 50);
          this.fetchMusic();
        } else {
          this.show = true;
        }
      }
    },
    musicEnd() {
      console.log("end 播放状态自动关闭");
      this.is_play = false;
      this.is_can_play = false;
      if (this.close_status) {
        if (this.skip_chapter <= 1) {
          this.skip_chapter = 0;
          this.close_status = false;
          return;
        } else {
          --this.skip_chapter;
        }
      }
      this.nextMusic();
    },
    musicCanPlay() {
      this.end_time = realFormatSecond(this.$refs.video.duration);
      this.run_time = realFormatSecond(this.$refs.video.currentTime);
      this.is_play = true;
      this.is_can_play = true;
      if (this.$refs.video.paused) {
        this.playMusic();
      }
    },
    onTimeupdate(res) {
      if (this.$refs.video.currentTime < this.skip_start_time) {
        this.$refs.video.currentTime = this.skip_start_time;
      }
      if (
        this.auto_load &&
        this.$refs.video.currentTime + this.skip_end_time >
          this.$refs.video.duration
      ) {
        this.auto_load = false;
        this.$refs.video.currentTime = this.$refs.video.duration;
        return;
      }
      this.percentage =
        (parseInt(this.$refs.video.currentTime) /
          parseInt(this.$refs.video.duration)) *
        100;
      this.run_time = realFormatSecond(this.$refs.video.currentTime);
    },
    // vue请求
    async fetchMusic() {
      // return;
      let params = {
        bookId: this.bookId,
        chapterId: this.bookInfo.lastChapterId,
        uid: 0,
      };
      const resp = await bookOne(params);
      const res = resp.data;
      if (res.status === 0) {
        const webviewRes = this.scanclick();
        if (webviewRes.status === 0) {
          this.$notify({ type: "primary", message: "请求过快，请稍后再试" });
          return;
        } else {
          this.url = abc(webviewRes.src);
        }
      } else {
        this.url = abc(res.src);
      }
      this.auto_load = true;
    },
    // android方法请求
    scanclick() {
      const url =
        "https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/" +
        this.bookId +
        "/chapterId/" +
        this.bookInfo.lastChapterId +
        ".html";
      try {
        var str = window.androidinfo.showInfoFromJs(url);
        const res = JSON.parse(str);
        return res;
      } catch (error) {
        return { status: 0 };
      }
    },
    // 拖动进度条
    onChange(value) {
      this.$refs.video.currentTime = (value / 100) * this.$refs.video.duration;
    },
    // 播放暂停
    playMusic() {
      if (this.is_can_play) {
        if (this.$refs.video.paused) {
          this.is_play = true;
          this.$refs.video.play();
        } else {
          this.is_play = false;
          this.$refs.video.pause();
        }
        this.end_time = realFormatSecond(this.$refs.video.duration);
      } else if (this.close_status === false && this.is_can_play === false) {
        this.nextMusic();
      }
    },
    // 上一首
    nextMusic() {
      console.log("下一首");
      let next_book = false;
      let nextChapter = {};
      this.bookIntroList.filter((item, index) => {
        if (item.chapterId === this.bookInfo.lastChapterId) {
          const nextChapterIndex = index + 1;
          if (
            0 < nextChapterIndex &&
            nextChapterIndex < this.bookInfo.currentBookListen.length
          ) {
            nextChapter = this.bookIntroList[nextChapterIndex];
            next_book = true;
          }
        }
      });
      if (next_book) {
        this.bookInfo.lastChapterTitle = nextChapter.chapterTitle;
        this.bookInfo.lastChapterId = nextChapter.chapterId;
        this.bookUpdateFavCurrent();
        this.fetchMusic();
      } else {
        this.$notify({ type: "primary", message: "没有更多了！" });
      }
    },
    // 下一首
    lastMusic() {
      console.log("上一首");
      let last_book = false;
      let lastChapter = {};
      this.bookIntroList.filter((item, index) => {
        if (item.chapterId === this.bookInfo.lastChapterId) {
          const lastChapterIndex = index - 1;
          if (
            0 < lastChapterIndex &&
            lastChapterIndex < this.bookInfo.currentBookListen.length
          ) {
            lastChapter = this.bookIntroList[lastChapterIndex];
            last_book = true;
          }
        }
      });
      if (last_book) {
        this.bookInfo.lastChapterTitle = lastChapter.chapterTitle;
        this.bookInfo.lastChapterId = lastChapter.chapterId;
        this.bookUpdateFavCurrent();
        this.fetchMusic();
      } else {
        this.$notify({ type: "primary", message: "已经到头了！" });
      }
    },
    // 快进
    addTime(value) {
      this.$refs.video.currentTime += value;
    },
    // 展示选择播放速度
    onSelectRate(item) {
      this.isRate = false;
      this.rate_play = item.value;
      this.$refs.video.playbackRate = this.rate_play;
    },
    // 展示定时播放
    onSelectChapter(item) {
      this.isChapter = false;
      if (item.value === 0) {
        this.close_status = false;
      } else {
        this.close_status = true;
      }
      this.skip_chapter = item.value;
    },
    // 展示跳过头尾
    onSelectShow(item) {
      this.isShow = false;
    },
    // 展示集数列表
    onSelectChapterOptions(item) {
      this.isList = false;
    },
    // 切歌
    playClickChapter(item) {
      this.bookInfo.lastChapterTitle = item.chapterTitle;
      this.bookInfo.lastChapterId = item.chapterId;
      this.bookUpdateFavCurrent();
      this.isList = false;
      this.fetchMusic();
    },
    // 展示50集数
    showCutChapter(val) {
      const start_chapter = val * 50 - 50;
      const end_chapter = val * 50;
      this.cutChapterList = this.bookIntroList.slice(
        start_chapter,
        end_chapter
      );
    },
    // 不显示模态
    onClickLeft() {
      this.show = false;
    },
    // 清除缓冲暂停播放
    resetCache(){
      if(this.is_play){
        this.playMusic()
      }
      // 重置data https://zhuanlan.zhihu.com/p/110978595
      Object.assign(this.$data, this.$options.data())
      this.tab_active = this.$route.name;
      // this.key = this.$route.path
    }
  },
};
</script>
<style lang="scss">
$head-height: 46px;
$foot-height: 50px;
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.head {
  height: $head-height;
  background-color: aquamarine;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.foot {
  height: $foot-height;
  background-color: antiquewhite;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0rem;
}
.content {
  padding-top: 20px;
  position: absolute;
  left: 0;
  top: $head-height;
  bottom: $foot-height;
  z-index: 1;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.playContent {
  width: 100%;
  height: 100%;
}
.video {
  display: none;
}
</style>


<style lang="scss" >
.rate-play .van-dropdown-menu .van-dropdown-menu__bar {
  background-color: transparent;
  box-shadow: none;
}
.rate-play .van-dropdown-item__option--active {
  background-color: transparent;
}
.music-back .van-nav-bar.van-hairline--bottom {
  background-color: transparent;
}
.music-back .van-nav-bar.van-hairline--bottom[class*="van-hairline"]::after {
  border: none;
}
</style>


<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  .down {
    width: 100%;
    padding-top: 5%;
    padding-left: 20%;
    height: 20px;
  }
}
.music-skip {
  width: 100%;
  text-align: center;
  .rate-play {
    width: 20%;
    text-align: center;
    margin: 0 auto;
  }
  p {
    height: 25px;
    line-height: 25px;
  }
}
.music-back {
  background-image: linear-gradient(to top, #5ee7df 0%, #b490ca 100%);
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .music-play {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .music-return {
      // position: absolute;
      width: 100%;
      padding-left: 15px;
      height: 5%;
      width: 100%;
      position: absolute;
      /* left: 20px; */
      line-height: 40px;
    }
    .music-img {
      margin: 25%;
      height: 60%;
      overflow: hidden;
      img {
        width: 100%;
      }
      .book-info {
        text-align: center;
        p {
          margin: 2px;
        }
      }
    }
    .music-control {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-flow: row wrap;

      .music-icon {
        display: flex;
        align-items: center;
        width: 100%;
        height: 10%;
        justify-content: space-around;
      }
      .music-progress {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .music-pro {
          width: 100%;
          margin: 0 5%;
        }
        .run-time {
          margin-left: 5%;
        }
        .end-time {
          margin-right: 5%;
        }
      }
      .music-plays {
        height: 30%;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        // margin-bottom: 20px;
      }
    }
  }
}
.video {
  display: none;
}
.slider {
  height: 120px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  .slider-tab {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    div {
      width: 100%;
      margin: 0 5%;
    }
    p {
      width: 55%;
      margin-left: 5%;
    }
  }
}
</style>

<style lang="">
</style>