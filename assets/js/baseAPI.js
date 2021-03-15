$(function () {
    // 开发环境
    let baseURL = 'http://api-breakingnews-web.itheima.net';

    $.ajaxPrefilter(function (options) {
        // 如果是index.html页面，不需要添加前缀
        if (options.url === 'http://127.0.0.1:5500/index.html') {
            return;
        };

        options.url = baseURL + options.url;

        // 需求2： 设置身份信息，包含 /my/ 的都添加 headers
        if (options.url.indexOf('/my/') != -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || '',
            }
        };

        // 拦截所有响应，判断身份认证信息
        options.complete = function (res) {
            console.log(res.responseJSON);
            let obj = res.responseJSON;
            if (obj.status == 1 && obj.message == "身份认证失败！") {
                // 跳转到 login 页面
                location.href = '/login.html';
                // 移除 token
                localStorage.removeItem('token');
            }
        }

    });
})