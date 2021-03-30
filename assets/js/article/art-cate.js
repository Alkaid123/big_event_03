$(function () {
    // 封装函数 文章类别渲染
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                // console.log(res.data);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功，渲染
                let htmlStr = template('tml-art-cate', { data: res.data })
                $('tbody').html(htmlStr);
            }
        });
    };

    // 点击添加类别，弹出框
    let layer = layui.layer;
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    });

    // 提交表单 新增分类 需要事件委托
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交
        e.preventDefault();

        // 发送ajax
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功 关闭弹框 弹出成功弹框 渲染页面
                layer.msg('恭喜您，添加类别成功', { icon: 6 });
                layer.close(indexAdd);
                initArtCateList();
            }
        });
    });

    // 点击 编辑，弹出框
    let form = layui.form;
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 获取Id
        let id = $(this).attr("data-id");
        // console.log(id);

        // 发送ajax请求
        $.ajax({
            url: '/my/article/cates/' + id,
            type: 'GET',
            success: (res) => {
                // console.log(res);
                form.val("form-edit", res.data);
            }
        });
    })

    // 获取 文章分类数据
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功 渲染页面 关闭弹框 弹框
                initArtCateList();
                layer.msg('恭喜您，文章修改成功', { icon: 6 });
                layer.close(indexEdit);
            }
        });
    });

    // 点击删除，删掉本条分类
    $('tbody').on('click', '.btn-delete', function () {
        // 获取点击的id
        const Id = $(this).attr("data-id");
        // console.log(Id);

        // 弹框，询问是否删除
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax请求
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message, { icon: 5 });
                    };

                    // 成功 弹框，渲染页面
                    layer.msg('删除文章类别成功', { icon: 6 });
                    initArtCateList();
                    layer.close(index);
                }
            });

        });


    })



})