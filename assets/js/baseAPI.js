$(function () {
    // 开发环境
    let baseURL = 'http://api-breakingnews-web.itheima.net';

    $.ajaxPrefilter(function (options) {
        // 如果是index.html页面，不需要添加前缀
        if (options.url === 'http://127.0.0.1:5500/index.html') {
            return;
        };

        options.url = baseURL + options.url;
    });
})