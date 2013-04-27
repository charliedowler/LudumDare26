var http;
var level;
var blocks, upsidedown;
var images = new Array();
var numofloaded = 0;
var totalLoaded = 12;
var player;
var blockspeed = 10;
var spam = false;
var seconds = 0, secEnd = false;
var bgpos = 0;
var timesHit = 0;
var bounce = new Audio("sounds/change.mp3");
var gameEnd = false;
document.onkeydown = function() {
    if (start) {
    if (!spam) {
    spam = true;
    bounce.play();
    player.vely = -player.vely;
    }
    }
    else {        
        username += String.fromCharCode(event.keyCode).toLowerCase();
        username = username.substring(0, 10);
        if (event.keyCode === 8) {
        username = username.substring(0, username.length - 2);
    }
    }
};
document.onkeyup = function() {
    spam = false;
};
function load() {
if (!secEnd) {
secEnd = true;
timer();
}
http = new XMLHttpRequest();
blocks = new Array();
upsidedown = new Array();
player = new Player(100, 200, 30, 30);
window.removeEventListener("click", startGame, false);
    for (i=1;i<=totalLoaded;i++) {
        loadImage(i);
    }
    for (i=0;i<20;i++) {
    blocks.push(new Block(i*50, 0, 55));
    }
    for (i=0;i<20;i++) {
    upsidedown.push(new Block(i*50, 500, 55));
    }
function Player(x, y, w, h) {
    this.Sprite = new Image();
    this.Sprite.src = "images/player.fw.png";
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.rotate = 0.5;
    this.vely = -5;
    this.isCollide = function(obj) {
        if (this.x + this.width < obj.x) return false;
        if (this.x > obj.x + obj.width) return false;
        if (this.y + this.height < obj.y) return false;
        if (this.y > obj.y + obj.height) return false;
        return true;
    };
}
function loadImage(name) {
    images[name] = new Image();
    images[name].onload = function() {
        numofloaded+=1;
    };
    images[name].src = "images/blocks/" + name+".png";
}
function Block(x, y, w) {
    this.Sprite = ranBlock();
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = 20;
    this.hit = false;
}
Block.prototype.Draw = function() {
    this.height = this.Sprite.height;
    ctx.drawImage(this.Sprite, this.x, this.y);
};
gameLoop();
}
function gameLoop() {
if (seconds >= 60) {
    gameEnd = true;
}
ctx.clearRect(0, 0, canvas.width, canvas.height);
if (!gameEnd) {
ctx.save();
ctx.translate(player.x + player.width, player.y + player.height / 2);
ctx.rotate(Math.PI * player.rotate);
ctx.drawImage(player.Sprite, -(player.width / 2), -(player.height / 2));
ctx.restore();
player.rotate += .05;
player.y += player.vely;
for (i in blocks) {
    blocks[i].Draw();
    blocks[i].x -=blockspeed;
    bgpos -= .01;
    canvas.setAttribute("style", "background-position: "+bgpos);
    if (blocks[i].x + blocks[i].width < 0) {
        blocks[i].Sprite = ranBlock();
        blocks[i].x = canvas.width + 10;        
    }
    if (player.isCollide(blocks[i]) && !blocks[i].hit) {
        blocks[i].hit = true;
        timesHit += 1;
        debug(timesHit);
    }
    if (!player.isCollide(blocks[i]) && blocks[i].hit) {
        blocks[i].hit = false;
    }
}
for (i in upsidedown) {
    upsidedown[i].y = canvas.height - upsidedown[i].Sprite.height;
    if (player.isCollide(upsidedown[i]) && !upsidedown[i].hit) {
        upsidedown[i].hit = true;
        timesHit += 1;
        debug(timesHit);
    }
    if (!player.isCollide(upsidedown[i]) && blocks[i].hit) {
        upsidedown[i].hit = false;
    }
ctx.drawImage(upsidedown[i].Sprite, upsidedown[i].x, upsidedown[i].y);
upsidedown[i].x -=blockspeed;
if (upsidedown[i].x + upsidedown[i].width * 2 < 0) {
        upsidedown[i].Sprite = ranBlock();
        upsidedown[i].x = canvas.width;
    }    
}
ctx.fillStyle = "#fff";
ctx.textAlign = "center";
ctx.font = "24px Arial";
ctx.fillText("Time: " + seconds, canvas.width - 50, 20);
if (timesHit > 60) {
    player.Sprite.src = "images/player_sad.fw.png";
}
setTimeout(gameLoop, 1000 / 30);
}
else {
    score();
}
}
function ranBlock() {
    ran = Math.floor(Math.random()*totalLoaded)+1;
    return images[ran];
}
function timer() {
    seconds+=1;
    setTimeout(timer, 1000);
}
function score() {
    ctx.textAlign = "center";
    ctx.fillText("You hit " + timesHit + " blocks in 60 seconds.", canvas.width / 2, canvas.height / 2);
}
//Load level from json
/*
http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
     level = JSON.parse(http.responseText);
    }
};
http.open("GET", "levels/level1.json", false);
http.send();
for (i in level) {
    console.log(level[i]);
    blocks.push(new Block(level[i].x, level[i].y, 20, 20));
}
*/