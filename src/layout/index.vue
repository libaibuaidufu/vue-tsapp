<template>
  <div class="container">
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
      @changeShow="getRouteData(false, true)"
      v-if="this.$route.name !== 'PlayMusic'"
    />
    <div class="settings-action">
      <van-action-sheet
        v-model="isSettings"
        title="设置"
        @select="onSettingsShow"
      >
        <div class="settings">
          <van-field
            v-model="columns[settings_option.link_index]"
            is-link
            readonly
            label="连接"
            placeholder="选择链接"
            @click="showPicker = true"
          />
          <van-popup v-model="showPicker" round position="bottom">
            <van-picker
              title="连接"
              show-toolbar
              ref="van_picker"
              :columns="columns"
              @cancel="showPicker = false"
              @confirm="onConfirm"
              :default-index="settings_option.link_index"
            />
          </van-popup>
          <van-field label="缓存">
            <template #input>
              <van-button
                plain
                type="primary"
                @click="onClickRight"
                size="small"
                >清除</van-button
              >
            </template>
          </van-field>
          <van-field label="关于">
            <template #input>
              <van-button plain type="primary" @click="onAbout" size="small"
                >关于软件</van-button
              >
            </template>
          </van-field>
        </div>
      </van-action-sheet>
    </div>
    <play-music ref="music" v-show="show" />
  </div>
</template>

<script>
import BookFooter from "../components/BookFooter.vue";
import BookHeader from "../components/BookHeader.vue";
import BookReHead from "../components/BookReHead.vue";
import PlayMusic from "./components/PlayMusic.vue";
import { bookSearch } from "../api/book";
import { saveCurrentPath, getSoft } from "../utils/androidFun";
import { resetCache } from "../utils/localSave";

export default {
  components: { BookHeader, BookFooter, BookReHead, PlayMusic },
  name: "Home",
  data() {
    return {
      showPicker: false,
      // columns: ["android","本地",'服务器'],
      // columns: ["本地",'服务器'],
      columns: ["本地"],
      tab_active: "BookSearch",
      loading: false,
      finished: false,
      searchBook: [],
      keyword: "",
      page: 20,
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
      saveCurrentPath(this.$route.name);
      return this.$route.path;
    },
    title() {
      return this.$route.meta.title;
    },
    isReturn() {
      return this.$route.meta.isReturn;
    },
    isSettings: {
      get() {
        return this.$store.getters.getIsSettings;
      },
      set(val) {
        this.$store.dispatch("updateIsSettings", val);
      },
    },
    settings_option: {
      get() {
        return this.$store.getters.getSettings;
      },
      set(val) {
        this.$store.dispatch("updateSettings", val);
      },
    },
    is_play: {
      get() {
        // vuex 控制首页播放暂停图标 变化
        return this.$store.getters.getIsPlay;
      },
      set(val) {
        this.$store.dispatch("updateIsPlay", val);
      },
    },
  },
  watch: {
    settings_option: {
      handler(newName, oldName) {
        this.settings_option = newName;
      },
      deep: true,
    },
  },
  methods: {
    onAbout() {
      const res = getSoft();
      this.$dialog.confirm({
        title: "关于软件",
        message: "这是假的" + res,
      });
    },
    onConfirm(value, index) {
      this.settings_option.link_index = index;
      this.$nextTick(() => {
        this.$refs.van_picker.setIndexes([index]); // 注意这里是数组[索引值]
      });
      this.showPicker = false;
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
    pushToBookInfo() {
      this.show = false;
      this.$router.push({
        name: "BookInfo",
        params: {
          id: this.bookInfo.bookId,
        },
      });
    },
    getRouteData(isBook = false, isSame = false) {
      this.$refs.music.getRouteData(isBook, isSame);
    },
    onSettingsShow() {
      this.isSettings = false;
    },
    // 清除缓冲暂停播放
    resetCache() {
      if (this.is_play) {
        this.$refs.music.playMusic();
      }
      // 重置data https://zhuanlan.zhihu.com/p/110978595
      Object.assign(this.$refs.music.$data, this.$refs.music.$options.data());
      this.tab_active = this.$route.name;
    },
    onClickRight() {
      this.$store.dispatch("updateFavList", []);
      this.$store.dispatch("updateCurrentBook", {});
      resetCache();
      this.resetCache();
    },
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




<style lang="scss" scoped>
.settings-action {
  width: 100%;
  text-align: center;
}
.settings {
  height: 180px;
  // width: 100%;
  margin: 0 5%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
</style>

<style lang="">
</style>