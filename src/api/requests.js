import axios from 'axios'

// create an axios instance
const service = axios.create({
    // baseURL: settings.SERVER_URL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 25000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    request => {
        request.headers={
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        }
        return request
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

//http-响应拦截
service.interceptors.response.use(
    response => {
        console.log(response)
        return response
    },
    error => {
        return Promise.reject(error)
    }
)


export default {
    pcget(url, param = {}) {//get请求
        return new Promise((resolve) => {
            service({
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    // 'Referer': 'https://www.tingxiaoshuo.cc',
                    // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
                },
                method: 'get',
                url,
                params: param,
            }).then(res => {
                resolve(res)
            })
        })
    },
    get(url, param = {}) {//get请求
        return new Promise((resolve) => {
            service({
                method: 'get',
                url,
                params: param,
            }).then(res => {
                resolve(res)
            })
        })
    },
    post(url, param) {//post请求
        return new Promise((resolve) => {
            service({
                method: 'post',
                url,
                data: param,
            }).then(res => {
                resolve(res)
            })
        })
    },
    put(url, param) {//put请求
        return new Promise((resolve) => {
            service({
                method: 'put',
                url,
                data: param,
            }).then(res => {
                resolve(res)
            })
        })
    },
    delete(url, param) {//delete请求
        return new Promise((resolve) => {
            service({
                method: 'delete',
                url,
                data: param,
            }).then(res => {
                resolve(res)
            })
        })
    },
    upload(url, data) {//上传文件
        return new Promise((resolve) => {
            let formData = new FormData();
            // formData.append('name',name)
            formData.append('file', data)
            console.log('formData:', formData.get('file'))
            axios({
                method: 'post',
                url,
                data: formData,
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then(res => {
                resolve(res)
            })
        })
    },
}

