$(function () {
    // 为 art-template 定义事件过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);

        let y = addZero(dt.getFullYear());
        let m = addZero(dt.getMonth() + 1);
        let d = addZero(dt.getDate());

        let hh = addZero(dt.getHours());
        let mm = addZero(dt.getMinutes());
        let ss = addZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    };

    // 补零
    function addZero(num) {
        return num < 9 ? num = '0' + num : num
    };

    // 定义一个全局变量
    let q = {
        pagenum: 1,    // 是	int	页码值
        pagesize: 2,    // 	是	int	每页显示多少条数据
        cate_id: "",    // 否	string	文章分类的 Id
        state: "",    // 否	string	文章的状态，可选值有：已发布、草稿
    };

    let layer = layui.layer;
    initTable();
    // 初始化页面，定义函数
    function initTable() {
        // 发送ajax请求
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            success: (res) => {
                // console.log(res);
                // 失败
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功
                let htmlStr = template("tpl-table", { data: res.data });
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total);
            }
        });
    }

    let form = layui.form;
    // 所有分类
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
            let htmlStr = template("tpl-cate", { data: res.data });
            $('[name="cate_id"]').html(htmlStr);
            form.render();
        }
    });

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        // 取消表单的默认提交行为
        e.preventDefault();

        // 获取内容
        let state = $('[name="state"]').val();
        let cate_id = $('[name="cate_id"]').val();

        // 赋值
        q.state = state;
        q.cate_id = cate_id;

        // 初始化文章列表，刷新列表
        initTable();
    });

    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  // 每页几条数据
            curr: q.pagenum,    // 第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 触发jump：分页初始化的时候，页面改变的时候
            jump: function (obj, first) {
                // obj:所有参数所在对象； first：是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                // 判断，不是第一个初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    initTable();
                };
            },
        });
    };

    // 删除，事件委托
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章Id
        let Id = $(this).attr('data-id');
        // console.log(Id);

        // 显示对话框
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送ajax请求
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    // 失败
                    if (res.status != 0) {
                        return layer.msg(res.message, { icon: 5 });
                    };

                    // 成功，弹框，并刷新页面
                    layer.msg('恭喜您，删除文章成功', { icon: 6 });
                    // 判断
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            });

            layer.close(index);
        });

    })
});