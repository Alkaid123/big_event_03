$(function () {
    let layer = layui.layer;
    // 1、获取用户信息
    getUserInfo();

    // 2、退出功能
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 回到 登录页面，销毁 token 值
            localStorage.removeItem('token');
            location.href = '/login.html';

            layer.close(index);
        });
    });
});

// 定义一个全局函数，其它页面也要用
function getUserInfo() {
    // 页面一加载就渲染
    $.ajax({
        url: '/my/userinfo',
        // type: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: (res) => {
            // console.log(res);
            // console.log(res.data);
            // 失败
            if (res.status != 0) {
                return layer.msg(res.message, { icon: 5 });
            };

            // 成功
            // 渲染头像和页面
            renderAvatar(res.data);
        },

    });
};

function renderAvatar(options) {
    // console.log(options);
    // 判断是否有昵称，如果有昵称，则显示昵称，如果没有，则显示用户名称
    let name = options.nickname || options.username;
    // 渲染名字
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 渲染头像
    // 如果有上传头像则渲染上传的头像，没有则 上传首字母大写
    if (options.user_pic != null) {
        $('.layui-nav-img').show('src', options.user_pic);
        $('.text-avatar').hide();
    } else {
        let text = name[0].toUpperCase();
        // console.log(text);
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(text);
    };
}