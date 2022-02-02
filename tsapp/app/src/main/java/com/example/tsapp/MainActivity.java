package com.example.tsapp;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;


import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.widget.Button;

import com.example.tsapp.utils.X5WebView;
import com.tencent.smtt.sdk.WebSettings;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    private X5WebView mWebView;
    private Context mContext = null;
    private static boolean main_initialized = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 取消标题
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        // 进行全屏
        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main);
        mContext = this;
        if (!main_initialized) {
            this.new_init();
        }

    }

    private void new_init() {

        mWebView = (X5WebView) this.findViewById(R.id.webview);

        mWebView.addJavascriptInterface(this, "androidinfo");//添加js监听 这样html就能调用客户端
        mWebView.loadUrl("file:android_asset/index.html");
//        Button btnBack;
//        btnBack = (Button) this.findViewById(R.id.button);
//        btnBack.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                //在屏幕上显示提示 Toast 吐司
//                Log.e("gs", "进来了");
//                String mIntentUrl = "http://app.html5.qq.com/navi/index";
//                mWebView.loadUrl(mIntentUrl);
//                Toast.makeText(MainActivity.this, "匿名内部内方式", Toast.LENGTH_SHORT).show();
//            }
//        });
        main_initialized = true;
    }

    @JavascriptInterface
    public static String showInfoFromJs(String url) {
        android.util.Log.i("tag", "来自JS的传参 :" + url);
        String result = "";
        BufferedReader in = null;// 读取响应输入流
        try {
            CookieManager cookieManager = new CookieManager();
            CookieHandler.setDefault(cookieManager);
//            String data[] = new String[30];
//            data[0] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
//            data[1] = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)";
//            data[2] = "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
//            data[3] = "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)";
//            data[4] = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)";
//            data[5] = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)";
//            data[6] = "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)";
//            data[7] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)";
//            data[9] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1";
//            data[10] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0";
//            data[11] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11";
//            data[12] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20";
//            data[13] = "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52";
//            data[14] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/2.0 Safari/536.11";
//            data[15] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER";
//            data[16] = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)";
//            data[17] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E; LBBROWSER)";
//            data[18] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 LBBROWSER";
//            data[19] = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)";
//            data[20] = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)";
//            data[21] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)";
//            data[22] = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SV1; QQDownload 732; .NET4.0C; .NET4.0E; 360SE)";
//            data[23] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)";
//            data[24] = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)";
//            data[25] = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1";
//            data[26] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1";
//            data[27] = "Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5";
//            data[28] = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre";
//            data[29] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11";
//            Random r = new Random();
//            String ua = data[r.nextInt(30)];
            // 创建URL对象
            java.net.URL connURL = new java.net.URL(url);
            // 打开URL连接
            java.net.HttpURLConnection httpConn = (java.net.HttpURLConnection) connURL
                    .openConnection();
            // 设置通用属性
            httpConn.setRequestProperty("Accept", "application/json, text/javascript, */*; q=0.01");
            httpConn.setRequestProperty("Connection", "Keep-Alive");
//            httpConn.setRequestProperty("cookie", "__51uvsct__JKeSBtlVceVtWkQX=1; __51vcke__JKeSBtlVceVtWkQX=125d11e5-fd92-5ab5-b524-81f181345ac0; __51vuft__JKeSBtlVceVtWkQX=1643545052464; Hm_lvt_03d3be6be07713090d718aa439330170=1643545157; _ga=GA1.2.893703207.1643545158; _gid=GA1.2.1437478780.1643545158; uid=35689; token=f355ce5b6b5b7e2a3999f71f736949a1; gonggaotime=1643545145; _gat_gtag_UA_198991932_1=1; __vtins__JKeSBtlVceVtWkQX=%7B%22sid%22%3A%20%22506ca2f3-c118-5ea9-aa97-5447098b953a%22%2C%20%22vd%22%3A%2010%2C%20%22stt%22%3A%20175488%2C%20%22dr%22%3A%206591%2C%20%22expires%22%3A%201643547027950%2C%20%22ct%22%3A%201643545227950%7D; Hm_lpvt_03d3be6be07713090d718aa439330170=1643545230");
            httpConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36");
            Map<String, List<String>> headerss = httpConn.getRequestProperties();
            // 遍历所有的响应头字段
            for (String key : headerss.keySet()) {
                android.util.Log.i("tag", key + headerss.get(key));
            }
            // 建立实际的连接
            httpConn.connect();
            // 响应头部获取
            Map<String, List<String>> headers = httpConn.getHeaderFields();
            // 遍历所有的响应头字段
            for (String key : headers.keySet()) {
                android.util.Log.i("tag", key + headers.get(key));
            }
            // 定义BufferedReader输入流来读取URL的响应,并设置编码方式
            in = new BufferedReader(new InputStreamReader(httpConn
                    .getInputStream(), StandardCharsets.UTF_8));
            String line;
            // 读取返回的内容
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            android.util.Log.i("tag", "来自JS的传参 :出错了");
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        android.util.Log.i("tag", "来自JS的传参 :" + result);
        return result;
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.loadUrl("javascript:callJsFunction()");
//            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }


    @JavascriptInterface
    public static String showLogs(String log) {
        android.util.Log.i("tag", log);
        return log;
    }
}