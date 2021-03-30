$(function () {
    // 初始化文章分类
    initCate();

    // 文章类别
    let form = layui.form;
    let layer = layui.layer;
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                // console.log(res);
                // 失败
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功
                let htmlStr = template("tpl-cates", { data: res.data });
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        });
    };

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 点击按钮，选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 设置图片
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的图片
        var file = e.target.files[0];

        // 非空校验
        if (file === undefined) {
            return layer.msg('你可以选择一张图片');
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });

    // 设置状态
    let state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    });

    // 发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        // 创建 FormData 对象
        let fd = new FormData(this);
        // 放入状态
        fd.append('state', state);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishArticle(fd);
            });


    })

    // 封装，添加文章的方法
    function publishArticle(fd) {
        // 发送ajax请求
        $.ajax({
            url: '/my/article/add',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                // 失败
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功
                layer.msg('恭喜您，发布文章成功', { icon: 6 })
                // 跳转到文章列表页面
                setTimeout(function () {
                    window.parent.document.getElementById("art-list").click();
                }, 1500);
            }
        });
    }
})