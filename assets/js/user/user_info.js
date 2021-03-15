$(function () {
    // 1、自定义校验规则
    let form = layui.form;
    // console.log(form);
    form.verify({
        nickname: function (value) {
            if (value.length < 1 || value.length > 6) {
                return '昵称长度为1 ~ 6 位！'
            }
        }
    });

    let layer = layui.layer;
    // 2、用户渲染
    initUserInfo();
    // 封装函数，后面会用到
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'GET',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                };

                form.val("formUserInfo", res.data);
            }
        });
    };

    // 3、表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

    // 4、修改表单
    $('.layui-form').on('submit', function (e) {
        // 取消表单默认提交行为
        e.preventDefault();

        // 发送 ajax 请求
        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功 弹框，并更新页面
                layer.msg('恭喜您，用户信息修改成功！', { icon: 6 });
                // 渲染头像和名字
                window.parent.getUserInfo();
            }
        });
    });
})