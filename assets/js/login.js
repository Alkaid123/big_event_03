$(function () {
    // 需求1： 点击 去注册账号，跳转到 注册页面
    $('#showReg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击 去登陆，跳转到 登录页面
    $('#showLogin').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义注册
    let form = layui.form;
    // console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6-16位，且不能输入空格'
        ],

        // // 确认密码规则
        repwd: function (value) {
            let pwd = $('.reg-box input[name="password"]').val();
            // console.log(pwd);
            if (value != pwd) {
                return '两次密码输入不一致，请重新输入！'
            };
        }
    });

    // 需求2：注册页面
    $('#reg-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $('.reg-box input[name="username"]').val(),
                password: $('.reg-box input[name="password"]').val()
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 注册成功，跳转到登录页面，并将注册页面的内容清空
                $('#showLogin').click();
                $('#reg-form')[0].reset();

            }
        });
    });

    // 需求3： 登录页面
    $('#login-form').on('submit', function (e) {
        // 取消表单默认行为
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 登录成功，跳转到 index 页面，并保存 token
                location.href = '/index.html';
                localStorage.setItem('token', res.token);
            }
        });

    });
});