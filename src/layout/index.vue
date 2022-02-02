<template>
  <div class="container">
    <book-header
      @on-search="bookSearch"
      v-if="this.$route.name === 'BookSearch'"
    />
    <book-re-head :title="title" :isReturn="isReturn" v-else />
    <div class="content">
      <router-view :key="key" :searchBook="searchBook" />
    </div>
    <book-footer :active="tab_active" @toggleClick="toggleClick" />
  </div>
</template>

<script>
import BookFooter from "../components/BookFooter.vue";
import BookHeader from "../components/BookHeader.vue";
import BookReHead from "../components/BookReHead.vue";
import { bookSearch } from "../api/book";
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
    };
  },
  computed: {
    key() {
      this.tab_active = this.$route.name;
      console.log(this.$route.name);
      return this.$route.path;
    },
    title() {
      return this.$route.meta.title;
    },
    isReturn() {
      return this.$route.meta.isReturn;
    },
  },
  methods: {
    async bookSearch(val) {
      this.keyword = val;
      const params = {
        search: this.keyword,
      };
      const res = await bookSearch(params);
      // window.androidinfo.showLogs(JSON.stringify(res))
      this.$store.dispatch("setSearchList",res.data.data.bookData)
      this.searchBook = res.data.data.bookData;
    },
    toggleClick(val) {
      this.tab_active = val;
      this.$router.push({
        name: val,
      });
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
</style>
