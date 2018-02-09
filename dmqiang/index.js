$(document).ready(function () {
    // 调用野狗云api，messages:弹幕文本数据
    var ref = new Wilddog("https://dmqiang.wilddogio.com/messages");
    var arr = [];
    // 把数据提交到野狗云
    $(".s_sub").click(function () {
        // 缓存数据
        var text = $(".s_txt").val();
        // 上传数据
        ref.child('message').push(text);
        $(".s_txt").val('');
    });
    // 响应按键点击事件，keypress：获取按键事件
    $(".s_txt").keypress(function (event) {
        if (event.keyCode === 13) {
            $(".s_sub").trigger('click');
        }
    });
    // 响应按键清除事件
    $(".s_del").click(function () {
        ref.remove();
        arr = [];
        // empty:空的
        $('.dm_show').empty();
    });
    // 监听云端数据变更，弹幕框数据跟随云端数据变化
    // snapshot:云端数据
    ref.child('message').on('child_added', function (snapshot) {
        var text = snapshot.val();
        arr.push(text);
        // 缓存弹幕数据
        var textObj = $("<div class=\"dm_message\"></div>");
        textObj.text(text);
        $(".dm_show").append(textObj);
        moveObj(textObj);
    });

    // 清除弹幕数据
    ref.on('child_removed', function () {
        arr = [];
        $('.dm_show').empty();
    });
    // 按照时间先后显示弹幕内容
    var topMin = $('.dm_mask').offset().top;
    var topMax = topMin + $('.dm_mask').height();
    //缓存topMin
    var _top = topMin;

    var moveObj = function (obj) {
        var _left = $('.dm_mask').width() - obj.width();
        _top = _top + 50;
        if (_top > (topMax - 50)) {
            _top = topMin;
        }
        obj.css({
            left: _left,
            top: _top,
            color: getRandomColor()
        });
        // random():随机生成一个0到1的数
        var time = 20000 + 10000 * Math.random();
        // 弹幕随时间向左移动
        obj.animate({
            left: "-" + _left + "px"
        }, time, function () {
            obj.remove();
        });
    }

    // getRandomColor：随机生成颜色
    var getRandomColor = function () {
        return '#' + (function (h) {
            return new Array(7 - h.length).join("0") + h
        })((Math.random() * 0x1000000 << 0).toString(16))
    }

    // 发送弹幕
    var getAndRun = function () {
        if (arr.length > 0) {
            var n = Math.floor(Math.random() * arr.length + 1) - 1;
            var textObj = $("<div>" + arr[n] + "</div>");
            $(".dm_show").sppend(textObj);
            moveObj(textObj);
        }
        setTimeout(getAndRun, 3000);
    }
    // jQuery.fx.interval：设置或返回动画的帧速
    jQuery.fx.interval = 50;
    getAndRun();
});