// top = 38; 
// RIGHT = 39; 
// bottom = 40; 
// LEFT = 37; 

window.onload = function() {
    var wrap = document.getElementById("game");
    var model = document.getElementById("model")
    var scoreAudio = document.getElementById("scoreAudio");
    scoreAudio.loop = false
    var startGame = document.getElementById("startGame");
    var gameoverAudio = document.getElementById("gameoverAudio")
    gameoverAudio.loop = false
    var scoreElement = document.getElementById("score");
    var time = document.getElementById("time");
    gameStatus = {
        model: 200,
        gameIsStart: false,
        score: 0,
        time: 0
    }

    function createSnake() {
        for (var i = 1; i < 5; i++) { 
            newBody = document.createElement("span");
            newBody.style.left = (i - 1) * size + "px"
            newBody.style.top = 0
            wrap.appendChild(newBody);
            snake.push(newBody);
        }
    }

    function moveSnake() {
        var head = snake[snake.length - 1];
        LEFT = parseInt(head.style.left);
        TOP = parseInt(head.style.top);
        if (dir == "right") {
            snake[0].style.left = LEFT + size + "px";
            snake[0].style.top = TOP + "px";
        }
        if (dir == "bottom") {
            snake[0].style.top = TOP + size + "px";
            snake[0].style.left = LEFT + "px";
        }
        if (dir == "left") {
            snake[0].style.top = TOP + "px";
            snake[0].style.left = LEFT - size + "px";
        }
        if (dir == "top") {
            snake[0].style.top = TOP - size + "px";
            snake[0].style.left = LEFT + "px";
        }
        //得分碰撞检测
        if (parseInt(head.style.top) == foodPoint.y && parseInt(head.style.left) == foodPoint.x) {
            createFood()
            addSnakeBody()
            updateScore();
        }

        //死亡碰撞检测---碰撞边缘检测
        if (parseInt(head.style.top) > 380 || parseInt(head.style.top) < 0 || parseInt(head.style.left) < 0 || parseInt(head.style.left) > 380) {
            die()
            alert("你挂了，继续努力吧!失败原因：碰壁了.....");
        }


        //死亡碰撞检测---碰撞蛇身检测
        var deadArea = []; //死亡区域
        //取所有躯干(除头部以外)的所有坐标
        //生成deadArea死亡区域坐标集合
        for (var i in snake) {
            var deadAreaPoint = {}
            deadAreaPoint.x = parseInt(snake[i].style.left)
            deadAreaPoint.y = parseInt(snake[i].style.top)
            deadArea.push(deadAreaPoint)
        }
        //从死亡区域集合内删除当前头部坐标
        deadArea.pop()
        console.log(LEFT)
            //检测头部是否与集合内坐标发生碰撞
        for (var j in deadArea) {
            if (TOP == deadArea[j].y && LEFT == deadArea[j].x) {
                die()
                alert("你挂了，继续努力吧！失败原因：撞到自己了.....");
            }
        }
        //更新snake数组与视图的对应关系
        snake.push(snake.shift())
    }

    function createFood() {
        var ele = wrap.getElementsByTagName("i")[0];
        if (ele) {
            wrap.removeChild(ele)
        }
        foodPoint = {
            x: Math.round(Math.random() * 19) * 20,
            y: Math.round(Math.random() * 19) * 20
        } 
        food = document.createElement("i");
        food.style.left = foodPoint.x + "px";
        food.style.top = foodPoint.y + "px";
        wrap.appendChild(food);
    }

    function addSnakeBody() {
        //生成一节身体
        newBody = document.createElement("span");
        //将新生成的身体插入在蛇尾的位置
        newBody.style.left = snake[0].style.left
        newBody.style.top = snake[0].style.top
        wrap.appendChild(newBody);
        //更新数据映射关系
        snake.unshift(newBody);
    }
    //更新得分
    function updateScore() {
        scoreElement.className = "change"
        setTimeout(function() {
            scoreElement.className = "";
            gameStatus.score += 10;
            scoreElement.innerHTML = gameStatus.score;
        }, 500)
        scoreAudio.play()
    }

    function die() {
        clearInterval(t);
        gameoverAudio.play()
        stopClock();
        startGame.disabled = false;
    }
    window.onkeydown = function(event) {
        if (event.keyCode == 39 && dir != "left") {
            dir = "right"
        }
        if (event.keyCode == 38 && dir != "bottom") {
            dir = "top"
        }
        if (event.keyCode == 37 && dir != "right") {
            dir = "left"
        }
        if (event.keyCode == 40 && dir != "top") {
            dir = "bottom"
        }
        if (event.keyCode == 13 && !gameStatus.gameIsStart) {
            playGame();
        }
    }

    function clearData() {
        snake = [];
        dir = "right";
        snake = []
        deadArea = []
        wrap.innerHTML = ""
        size = 20;
    }

    function playGame() {
        clearData()
        createSnake()
        createFood()
        startClock()
        t = setInterval(function() {
            moveSnake()
        }, gameStatus.model)
    }

    function startClock() {
        gameStatus.time = 0
        clock = setInterval(function() {
            gameStatus.time++;
            if (gameStatus.time / 60 > 1) {
                var minutes = Math.floor(gameStatus.time / 60)
                var s = gameStatus.time - minutes * 60
                var timestr = minutes + "分" + s + "秒"
            } else {
                var s = gameStatus.time;
                var timestr = s + "秒"
            }
            time.innerHTML = timestr
        }, 1000)
    }

    function stopClock() {
        clearInterval(clock)
    }

    startGame.onclick = function() {
        if (!gameStatus.gameIsStart) {
            playGame();
            this.disabled = true;
        }
    }
    model.onchange = function() {
        gameStatus.model = this.value;
    }
}
