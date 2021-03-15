$(function () {
    // 1、自定义校验规则
    let form = layui.form;
    // console.log(form);
    form.verify({
        // 1、密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        // 2、新密码
        samePwd: function (value) {
            // 新密码和密码一致则报错
            if (value == $('input[name="oldPwd"]').val()) {
                return '新密码不能和原密码一致';
            }
        },
        // 3、确认新密码
        rePwd: function (value) {
            // 确认新密码与新密码不一致则报错
            if (value != $('input[name="newPwd"]').val()) {
                return '确认密码必须和新密码一致';
            }
        }
    });

    let layer = layui.layer;
    // 2、表单提交
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();

        // 发送 ajax 请求
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                // 失败弹框
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功弹框，重置密码框
                layer.msg('恭喜您，修改密码成功！', { icon: 6 });
                $('.layui-form')[0].reset();
            }
        });
    })
})