$(function () {
    // 封装函数
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                console.log(res.data);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };

                // 成功，渲染
                let htmlStr = template('tml-art-cate', { data: res.data })
                $('tbody').html(htmlStr);
            }
        });
    }
})