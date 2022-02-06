# tingbook

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 更新
###### 2022-02-03
1. 重新设计的播放页面，支持在任何页面播放
2. 增加了后台播放
3. 各种优化了

### 未实现功能
~~如果退出播放页面则无法播放，这个是设计的问题。~~
vuex本身应该是一动全身自动改变，而我却定义了过多的变量导致无法自动更新展示。
### 打包
将`yarn build`后的dist文件夹的内容放在 `tsapp/app/src/main/assets`中就可以直接用`android studio`打包了

### 预览图
 ![image](https://github.com/libaibuaidufu/vue-tsapp/blob/main/preview/搜索.jpg) 
 ![image](https://github.com/libaibuaidufu/vue-tsapp/blob/main/preview/收藏.jpg) 
 ![image](https://github.com/libaibuaidufu/vue-tsapp/blob/main/preview/详情.jpg) 
 ![image](https://github.com/libaibuaidufu/vue-tsapp/blob/main/preview/播放.jpg) 