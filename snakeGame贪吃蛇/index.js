var time = 200; //游戏界面刷新间隔时间
var  t = 3; //蛇的身长
var snakeMap = []; //记录蛇的运行轨迹，用数组记录每一个坐标点
var w = 10;  //蛇身单元大小
var direction = 37; //37 左 38 上 39 右 40 下
//蛇的初始坐标
var x = 0;
var y = 0;
//食物的初始坐标
var foodX = 0;
var foodY = 0;
//当前得分
var score = 0;
var bestScore = 0;
//画布宽高
var width = 400;
var height = 400;

var c =document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var restart = document.getElementById('restart');

showBestScore();
GameStart();
restart.onclick = function(){window.location.reload()};
//显示历史最高分
function showBestScore(){
    bestScore = localStorage.getItem('bestScore');
    if(!bestScore){
        bestScore = 0;
    }
    var best = document.getElementById('bestScore');
    best.innerHTML = bestScore;
}

//启动游戏
function GameStart(){
    drawFood();
    //随机生成贪吃蛇的头的坐标
    x = Math.floor(Math.random() * width / w) * w;
    y = Math.floor(Math.random() * height / w) * w;
    //随机生成蛇前进方向
    direction = 37 + Math.floor(Math.random() * 4);
    //每隔time秒刷新一次游戏内容
    setInterval(gameRefresh, time);
}

//游戏画面刷新
function gameRefresh(){
    //将当前坐标数据添加到贪吃蛇的运动轨迹坐标数组中
    snakeMap.push({'x':x, 'y':y});
    //绘制贪吃蛇
    drawSnake();
    //根据方向移动蛇头的下一个位置
    switch(direction){
        case 37: x-=w;break;
        case 38: y-=w;break;
        case 39: x+=w;break;
        case 40: y+=w;break;
    }
    //碰撞检测,返回值为0表示没有撞到障碍物
    var code = detectCollision();
    if(code != 0){
        if(score > bestScore){
            localStorage.setItem('bestScore', score);
        }
        //code ==1 表示撞到墙
        if(code == 1){
            alert('撞到了墙壁，游戏失败，当前得分：'+score);
        }
        //code==2 表示撞到了蛇身
        if(code == 2){
            alert("撞到了蛇身，游戏失败，当前的分："+score);
        }
        window.location.reload();
    }
    //吃到食物判定
    if(foodX == x && foodY == y){
        score += 10;
        var currentScore = document.getElementById('currentScore');
        currentScore.innerHTML = score;
        drawFood();
        t ++;
    }
}

//绘制贪吃蛇
function drawSnake(){
    //设置蛇身的内部的填充颜色
    ctx.fillStyle = "lightblue";
    ctx.fillRect(x, y, w, w);
    //数组只保留蛇身长度的数据，如果蛇前进了，则删除最久的坐标数据
    if(snakeMap.length > t){
        //删除数组的第一项，即蛇的尾部最后一个位置的坐标记录
        var lastBox = snakeMap.shift();
        //清除蛇的最后一个位置，从而实现移动效果
        ctx.clearRect(lastBox['x'], lastBox['y'], w, w);
    }
}

//改变蛇方向的按键监听
document.onkeydown = function(e){
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
        if(Math.abs(e.keyCode - direction) == 2){
            document.getElementById('tip').innerHTML = '不能后退的.....'
            setTimeout(function(){
                document.getElementById('tip').innerHTML = '继续加油'
            },3000)
        }else{
            direction = e.keyCode;
        }
    }
}


//碰撞检测函数
function detectCollision(){
    //蛇头碰到了四周的墙壁，游戏失败
    if(x > width || y > height || x < 0 || y < 0 ){
        return 1;
    }
    //蛇头碰到了蛇身，游戏失败
    for(var i = 0; i < snakeMap.length; i++){
        if(snakeMap[i].x == x && snakeMap[i].y == y){
            return 2;
        }
    }
    return 0;
}


//绘制食物函数
function drawFood(){
    foodX = Math.floor(Math.random() * width / w) *w;
    foodY = Math.floor(Math.random() * height / w) * w;
    //内部填充颜色
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, w, w);
}