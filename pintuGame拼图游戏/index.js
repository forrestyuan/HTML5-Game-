var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var num = [[00,01,02], [10,11,12],[20, 21, 22]];

//打乱拼图的位置函数
function generateNum(){
    for(var i = 0; i < 50; i++){
        //随机抽取其中一个数据
        var i1 = Math.round(Math.random() * 2);
        var j1 = Math.round(Math.random() * 2);
        //再次随机抽取一个数据
        var i2 = Math.round(Math.random() * 2);
        var j2 = Math.round(Math.random() * 2);
        //对调位置
        var temp = num[i1][j1];
        num[i1][j1] = num[i2][j2];
        num[i2][j2] = temp;
    }
}

//定义拼图小方块的边长
var w = 100;
//绘制拼图函数
function drawCanvas(){
    //清空画布
    ctx.clearRect(0, 0, 300, 300);
    //使用双重for循环绘制3 X 3 的拼图
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++ ){
            if(num[i][j] != 22){
                //获取数组的十位数，即第几行
                var row = parseInt(num[i][j] / 10);
                //获取数组的个位数，即第几列
                var col = num[i][j] % 10;
                //在画布的相关位置上绘图
                //参数1：切割的图片素材 参数2，3：切割的起始点位置坐标；参数4,5：切割的宽和高。
                //参数6,7表示绘制的坐标，参数8,9表示缩放的宽度和高度
                ctx.drawImage(img, col*w, row*w,w,w,j*w,i*w,w,w);
            }
        }
    }
}

var img = new Image();
img.src = "./pintu.jpg";
img.onload = function(){
    generateNum();
    drawCanvas();
}

//监听鼠标单击事件
c.onmousedown = function(e){
    //获取画布边界
    var bound = c.getBoundingClientRect();
    //获取鼠标在画布上的坐标位置（x, y）;
    var x = e.pageX - bound.left;
    var y = e.pageY - bound.top;
    //将x,y换算成几行几列
    var row = parseInt(y / w);
    var col = parseInt(x / w);

    //如果当前单击的不是空白区域
    if(num[row][col] != 22){
        //移动单击的方块
        detectBox(row, col);
        //重新绘制画布
        drawCanvas();
        //检查游戏是否成功
        var isWin = checkWin();
        if(isWin){
            clearInterval(timer);
            //绘制完整图片
            ctx.drawImage(img, 0, 0);
            ctx.font = " bold 68px serif";
            ctx.fillStyle = 'red';
            ctx.fillText("游戏成功", 20, 150);
        }
    }

}

function detectBox(row, col){
    //如果单击的方块不在最上面一行
    if( row > 0){
        //检测空白区域是否在当前方块的正上方
        if(num[row-1][col] == 22){
            //交换位置
            num[row-1][col] = num[row][col];
            num[row][col] = 22;
            return;
        }
    }

    //如果单击的方块不在最下面一行
    if( row < 2){
        //检测空白区域是否在当前方块的正下方
        if(num[row+1][col] == 22){
            //交换位置
            num[row+1][col] = num[row][col];
            num[row][col] = 22;
            return;
        }
    }

    //如果单击的方块不在最左边一列
    if( col > 0){
        //检测空白区域是否在当前方块的左边
        if(num[row][col-1] == 22){
            //交换位置
            num[row][col-1] = num[row][col];
            num[row][col] = 22;
            return;
        }
    }


    //如果单击的方块不在最右边一列
    if( col < 2){
        //检测空白区域是否在当前方块的右边
        if(num[row][col+1] == 22){
            //交换位置
            num[row][col+1] = num[row][col];
            num[row][col] = 22;
            return;
        }
    }
}

//获取游戏计时文本区域对象
var time = document.getElementById('time');
//初始化时，分，秒
var h = 0; m = 0; s = 0;
function getCurrentTime(){
    h = parseInt(h);
    m = parseInt(m);
    s = parseInt(s);
    //每秒变量s自增加一
    s ++ ;
    if( s == 60){
        s = 0;
        m++;
    }
    if( m == 60){
        m = 0;
        h++
    }
    //修改时分秒的显示格式
    if(s < 10){
        s = "0" + s;
    }
    if(m < 10){
        m = "0" + m;
    }
    if(h < 10){
        h = "0" + h;
    }
    time.innerHTML = h + ":" + m + ":" + s;
}
var timer = setInterval(getCurrentTime, 1000);
//胜利的判断

function checkWin(){
    for(var i = 0; i < 3; i++ ){
        for(var j = 0; j < 3; j++){
            if(num[i][j] != i * 10 + j){
                return false;
            }
        }
    }
    return true;
}


//重新开始游戏
var restart =document.getElementById('restart');
function restartFunc(){
    clearInterval(timer);
    s = 0;
    m = 0;
    h = 0;
    getCurrentTime();
    timer = setInterval(getCurrentTime, 1000);

    generateNum();
    drawCanvas();
}

restart.onclick = restartFunc;