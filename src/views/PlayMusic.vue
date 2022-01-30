<template>
  <div class="music-back">
    <video
      ref="video"
      class="video"
      @timeupdate="onTimeupdate"
      @ended="musicEnd"
      v-if="refresh"
    >
      <source :src="url" type="video/mp4" />
    </video>
    <van-overlay :show="is_show" @click="onShow">
      <div class="wrapper">
        <div class="slider">
          <div class="slider-tab">
            <p>跳过开头：{{ skip_start_time }}</p>
            <div>
              <van-slider v-model="skip_start_time" :min="0" :max="120" />
            </div>
          </div>
          <div class="slider-tab">
            <p>跳过结尾：{{ skip_end_time }}</p>
            <div>
              <van-slider v-model="skip_end_time" :min="0" :max="120" />
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
    <div class="music-play">
      <div class="music-img">
        <img :src="bookIntro.bookImage" alt="" />
        <div class="book-info">
          <p>{{ bookIntro.bookTitle }}</p>
          <p>{{ bookIntro.bookAnchor }}</p>
          <p>{{ chapterTitle }}</p>
        </div>
      </div>
      <div class="music-control">
        <div class="music-skip">
          <p @click="onShow">跳过头尾</p>
          <div class="rate-play">
            <van-dropdown-menu direction="up">
              <van-dropdown-item
                v-model="rate_play"
                :options="rate_option"
                @change="playbackRate"
              />
            </van-dropdown-menu>
          </div>
          <div class="rate-play">
            <van-dropdown-menu direction="up">
              <van-dropdown-item
                v-model="skip_chapter"
                :options="skip_options"
                @change="skipChapter"
              />
            </van-dropdown-menu>
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
          <van-icon name="play" v-if="is_play" @click="playMusic" />
          <van-icon name="pause" @click="playMusic" v-else />
          <van-icon name="arrow" @click="nextMusic" />
          <p @click="addTime(10)">+10s</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookOne } from "../api/book";
import {
  loadFavList,
  setFavList,
  removeFavSetFavList,
  pushFavSetFavList,
  isFav,
  getFav,
} from "../utils/utils";

export default {
  data() {
    return {
      rate_play: 1,
      rate_option: [
        {
          text: "x1",
          value: 1,
        },
        {
          text: "x1.25",
          value: 1.25,
        },
        {
          text: "x1.5",
          value: 1.5,
        },
        {
          text: "x1.75",
          value: 1.75,
        },
        {
          text: "x2",
          value: 2,
        },
      ],
      skip_chapter: 0,
      skip_options: [
        {
          text: "定时播放",
          value: 0,
        },
        {
          text: "一集",
          value: 1,
        },
        {
          text: "二集",
          value: 2,
        },
        {
          text: "三集",
          value: 3,
        },
        {
          text: "四集",
          value: 4,
        },
        {
          text: "五集",
          value: 5,
        },
      ],
      end_time: "0:00:00",
      run_time: "0:00:00",
      percentage: 0,
      skip_start_time: 0,
      skip_end_time: 0,
      is_play: true,
      is_show: false,
      url: "",
      bookId: 0,
      chapterId: 0,
      chapterTitle: "",
      refresh: true,
      bookIntro: {},
      bookIntroList: [],
      next_book: false,
      auto_load: true,
      watch_status: true,
      favDict: {},
      fav: false,
      close_status: false,
    };
  },
  mounted() {
    this.getRouteData();
    this.fetchMusic(false);
  },
  watch: {
    skip_start_time(val) {
      this.skip_start_time = val;
      this.favDict.skip_start_time = val;
      if (this.fav) {
        removeFavSetFavList(this.bookId, this.favDict);
      }
    },
    skip_end_time(val) {
      this.skip_end_time = val;
      this.favDict.skip_end_time = this.skip_end_time;
      if (this.fav) {
        removeFavSetFavList(this.bookId, this.favDict);
      }
    },
    url() {
      this.refresh = false;
      this.watch_status = false;
      this.$nextTick(() => {
        this.refresh = true;
        this.watch_status = true;
      });
    },
  },
  methods: {
    scanclick() {
      const url =
        "https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/" +
        this.bookId +
        "/chapterId/" +
        this.chapterId +
        ".html";
      var str = window.androidinfo.showInfoFromJs(url);
      const res = JSON.parse(str);
      return res;
    },
    realFormatSecond(second) {
      var secondType = typeof second;

      if (secondType === "number" || secondType === "string") {
        second = parseInt(second);

        var hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        var mimute = Math.floor(second / 60);
        second = second - mimute * 60;

        return (
          hours +
          ":" +
          ("0" + mimute).slice(-2) +
          ":" +
          ("0" + second).slice(-2)
        );
      } else {
        return "0:00:00";
      }
    },
    getRouteData() {
      this.bookId = this.$route.params.bookId;
      this.chapterId = this.$route.params.chapterId;
      this.chapterTitle = this.$route.params.chapterTitle;
      this.bookIntro = this.$route.params.bookIntro;
      this.bookIntroList = this.$route.params.bookIntroList;
      this.favDict = getFav(this.bookId, {
        bookId: this.bookId,
        bookIntro: this.bookIntro,
        bookChapter: this.$route.params.bookChapter,
        skip_start_time: 0,
        skip_end_time: 0,
      });
      this.skip_start_time = this.favDict.skip_start_time;
      this.skip_end_time = this.favDict.skip_end_time;
      this.fav = isFav(this.bookId);
    },
    async fetchMusic(play) {
      // let params = { bookId: this.bookId, chapterId: this.chapterId, uid: 0 };
      // const resp = await bookOne(params);
      //  cosnt res = resp.data
      const res = this.scanclick();
      if (res.status === 0) {
        this.$notify({ type: "primary", message: "请求过快，请稍后再试" });
        return;
      } else {
        this.url = this.abc(res.src);
      }
      if (play) {
        setTimeout(this.playMusic, 500);
      }
      this.auto_load = true;

      if (this.fav) {
        removeFavSetFavList(this.bookId, this.favDict);
      }
    },
    abc(u) {
      var tArr = u.split("*"),
        str = "";
      for (var i = 0, n = tArr.length; i < n; i++) {
        str += String.fromCharCode(tArr[i]);
      }
      return str;
    },
    musicEnd() {
      console.log(this.close_status, "close_status", this.skip_chapter);
      if (this.close_status) {
        if (this.skip_chapter === 0) {
          this.close_status = false;
          return;
        } else {
          --this.skip_chapter;
        }
      }
      this.nextMusic();
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
      this.run_time = this.realFormatSecond(this.$refs.video.currentTime);
    },
    onChange(value) {
      this.$refs.video.currentTime = (value / 100) * this.$refs.video.duration;
    },
    playMusic() {
      if (this.$refs.video.paused) {
        this.is_play = false;
        this.$refs.video.play();
      } else {
        this.is_play = true;
        this.$refs.video.pause();
      }
      if (this.$refs.video.duration) {
        this.end_time = this.realFormatSecond(this.$refs.video.duration);
      } else {
        if (this.$refs.video.paused) {
          this.is_play = false;
          this.$refs.video.play();
        } else {
          this.is_play = true;
          this.$refs.video.pause();
        }
      }
    },
    nextMusic() {
      console.log("下一首");
      this.is_play = true;
      this.$refs.video.pause();
      const next_chapterId = ++this.chapterId;
      this.bookIntroList.filter((item) => {
        if (item.chapterId === next_chapterId) {
          this.chapterTitle = item.chapterTitle;
          this.next_book = true;
          this.favDict.bookChapter = item;
        }
      });
      if (this.next_book) {
        this.fetchMusic(true);
        this.next_book = false;
      } else {
        this.chapterId = --this.chapterId;
        this.$notify({ type: "primary", message: "没有更多了！" });
      }
    },
    lastMusic() {
      console.log("上一首");
      this.is_play = true;
      this.$refs.video.pause();
      const next_chapterId = --this.chapterId;
      this.bookIntroList.filter((item) => {
        if (item.chapterId === next_chapterId) {
          this.chapterTitle = item.chapterTitle;
          this.next_book = true;
          this.favDict.bookChapter = item;
        }
      });
      if (this.next_book) {
        this.fetchMusic(true);
        this.next_book = false;
      } else {
        this.chapterId = ++this.chapterId;
        this.$notify({ type: "primary", message: "已经到头了！" });
      }
    },
    skipTime() {},
    onShow() {
      this.is_show = !this.is_show;
    },
    playbackRate(value) {
      this.$refs.video.playbackRate = this.rate_play;
    },
    skipChapter(value) {
      console.log(value);
      if (value > 0) {
        this.close_status = true;
      }
      this.skip_chapter = value;
    },
    addTime(value) {
      this.$refs.video.currentTime += value;
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
    height: 45%;
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
      margin-bottom: 20px;
    }
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
        color: aliceblue;
        width: 55%;
        margin-left: 5%;
      }
    }
  }
}
</style>