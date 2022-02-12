<template>
  <div class="music-back">
    <!-- <video
      ref="video"
      class="video"
      @canplay="musicCanPlay"
      @timeupdate="onTimeupdate"
      @ended="musicEnd"
      v-if="refresh"
    >
      <source :src="url" type="video/mp4" />
    </video> -->
    <div class="music-play">
      <div class="music-img">
        <img :src="bookInfo.bookIntro.bookImage" alt="" />
        <div class="book-info">
          <p>{{ bookInfo.bookIntro.bookTitle }}</p>
          <p>{{ bookInfo.bookIntro.bookAnchor }}</p>
          <p>{{ bookInfo.lastChapterTitle }}</p>
        </div>
      </div>
      <div class="music-control">
        <div class="music-skip">
          <p @click="isShow = true">跳过头尾</p>
          <p @click="isRate = true">播放速度X{{ rate_play }}</p>
          <p @click="isChapter = true" v-if="skip_chapter === 0">定时关闭</p>
          <p @click="isChapter = true" v-else>剩余{{ skip_chapter }}集</p>
          <p @click="isList = true">集数列表</p>
          <div>
            <van-action-sheet
              v-model="isShow"
              title="跳过头尾"
              @select="onSelectShow"
            >
              <div class="slider">
                <div class="slider-tab">
                  <p>跳过开头</p>
                  <van-stepper
                    v-model="skip_start_time"
                    min="0"
                    max="120"
                    name="跳过开头"
                    integer
                  />
                </div>
                <div class="slider-tab">
                  <p>跳过结尾</p>
                  <van-stepper
                    v-model="skip_end_time"
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
        </div>
        <div class="music-progress">
          <div class="run-time">{{ run_time }}</div>
          <div class="music-pro">
            <van-slider v-model="percentage" @change="onChange" />
          </div>
          <div class="end-time">{{ end_time }}</div>
        </div>
        <div class="music-play">
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
</template>

<script>
import { bookOne } from "@/api/book";
import { abc, realFormatSecond } from "../utils/utils";

export default {
  data() {
    return {
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
  mounted() {
    this.getRouteData();
    this.fetchMusic();
  },
  watch: {
    skip_start_time(val) {
      this.skip_start_time = val;
      this.bookInfo.skip_start_time = val;
      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
        this.$store.dispatch("updateCurrentBook", this.bookInfo);
      }
    },
    skip_end_time(val) {
      this.skip_end_time = val;
      this.bookInfo.skip_end_time = this.skip_end_time;
      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
        this.$store.dispatch("updateCurrentBook", this.bookInfo);
      }
    },
    url() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
  },
  methods: {
    getRouteData() {
      this.bookId = this.$route.params.bookId;
      this.bookInfo = Object.assign({}, this.$store.getters.getCurrentBook);
      // console.log(this.bookInfo);
      this.bookImage = this.bookInfo.bookIntro.bookImage;
      this.bookIntroList = this.bookInfo.currentBookListen;
      this.skip_start_time = this.bookInfo.skip_start_time;
      this.skip_end_time = this.bookInfo.skip_end_time;
      this.cutChapter = parseInt(Math.ceil(this.bookIntroList.length / 50));
      this.cutChapterList = this.bookIntroList.slice(0, 50);
    },
    musicEnd() {
      // console.log("end 播放状态自动关闭");
      this.is_play = false;
      this.is_can_play = false;
      // console.log(this.close_status, "close_status", this.skip_chapter);
      // console.log(this.$refs.video.paused);
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
      // // console.log("in");
      this.end_time = realFormatSecond(this.$refs.video.duration);
      this.run_time = realFormatSecond(this.$refs.video.currentTime);
      this.is_play = true;
      this.is_can_play = true;
      // // console.log(this.$refs.video.paused, this.run_time, this.end_time);
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
    async fetchMusic() {
      return;
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
      if (this.bookInfo.fav) {
        this.$store.dispatch("updateFav", this.bookInfo);
        // removeFavSetFavList(this.bookId, this.bookInfo);
      }
    },
    scanclick() {
      const url =
        "https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/" +
        this.bookId +
        "/chapterId/" +
        this.bookInfo.lastChapterId +
        ".html";
      var str = window.androidinfo.showInfoFromJs(url);
      const res = JSON.parse(str);
      return res;
    },

    onChange(value) {
      this.$refs.video.currentTime = (value / 100) * this.$refs.video.duration;
    },
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
    nextMusic() {
      // // console.log("下一首");
      let next_book = false;
      let nextChapter = {};
      // // console.log(this.bookIntroList);
      // // console.log(this.bookInfo.lastChapterId);
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
        this.$store.dispatch("updateFav", this.bookInfo);
        this.fetchMusic();
      } else {
        this.$notify({ type: "primary", message: "没有更多了！" });
      }
    },
    lastMusic() {
      // // console.log("上一首");
      let last_book = false;
      let lastChapter = {};
      // // console.log(this.bookIntroList);
      // // console.log(this.bookInfo.lastChapterId);
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
        this.$store.dispatch("updateFav", this.bookInfo);
        this.fetchMusic();
      } else {
        this.$notify({ type: "primary", message: "已经到头了！" });
      }
    },
    addTime(value) {
      this.$refs.video.currentTime += value;
    },
    onSelectRate(item) {
      this.isRate = false;
      this.rate_play = item.value;
      this.$refs.video.playbackRate = this.rate_play;
      // // console.log(item);
    },
    onSelectChapter(item) {
      this.isChapter = false;
      if (item.value === 0) {
        this.close_status = false;
      } else {
        this.close_status = true;
      }
      this.skip_chapter = item.value;
      // // console.log(item);
    },
    onSelectShow(item) {
      this.isShow = false;
    },
    onSelectChapterOptions(item) {
      // // console.log("jj");
      this.isList = false;
    },
    playClickChapter(item) {
      // // console.log(item);
      this.bookInfo.lastChapterTitle = item.chapterTitle;
      this.bookInfo.lastChapterId = item.chapterId;
      this.$store.dispatch("updateFav", this.bookInfo);
      this.isList = false;
      this.fetchMusic();
    },
    showCutChapter(val) {
      const start_chapter = val * 50 - 50;
      const end_chapter = val * 50;
      this.cutChapterList = this.bookIntroList.slice(
        start_chapter,
        end_chapter
      );
    },
  },
};
</script>
<style lang="scss" >
.rate-play .van-dropdown-menu .van-dropdown-menu__bar {
  background-color: transparent;
  box-shadow: none;
}
.rate-play .van-dropdown-item__option--active {
  background-color: transparent;
}
</style>

<style lang="scss" scoped>
.music-back {
  background-image: linear-gradient(to top, #5ee7df 0%, #b490ca 100%);
  height: 100%;
  overflow: hidden;
}
.video {
  display: none;
}
.music-play {
  width: 100%;
  height: 100%;
  display: flex;
  justify-items: flex-start;
  flex-flow: row wrap;
  .music-img {
    margin: 25%;
    height: 43%;
    img {
      width: 100%;
    }
    .book-info {
      text-align: center;
    }
  }
  .music-control {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: row wrap;
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
    .music-play {
      height: 30%;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      // margin-bottom: 20px;
    }
  }
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