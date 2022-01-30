'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = '听书app'

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
          alias: {
            '@': resolve('src')
          }
        }
      },
    devServer: {
        proxy: {  //配置跨域
            '/api': {
                // target: 'https://app.tingxiaoshuo.cc/listen/api',  //这里后台的地址模拟的;应该填写你们真实的后台接口
                // target: 'http://192.168.2.237:5000/api',  //这里后台的地址模拟的;应该填写你们真实的后台接口
                target: 'http://ts.kaizhu.xyz/api',  //这里后台的地址模拟的;应该填写你们真实的后台接口
                changOrigin: true,  //允许跨域
                pathRewrite: {
                    /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
                      实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
                     */
                    '^/api': ''
                }
            },
            '/apptingchina':{
                target: 'https://app.tingxiaoshuo.cc/listen/apptingchina',  //这里后台的地址模拟的;应该填写你们真实的后台接口
                changOrigin: true,  //允许跨域
                pathRewrite: {
                    /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
                      实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
                     */
                    '^/apptingchina': ''
                }
            },
            '/pc':{
                target: 'https://www.tingxiaoshuo.cc/pc',  //这里后台的地址模拟的;应该填写你们真实的后台接口
                changOrigin: true,  //允许跨域
                pathRewrite: {
                    /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
                      实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
                     */
                    '^/pc': ''
                },
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'Referer':' https://www.tingxiaoshuo.cc',
                    'user-agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
                },
            }
        }
    },
}