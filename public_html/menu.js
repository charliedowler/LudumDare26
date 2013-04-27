var canvas, ctx, doc = document;
var start = false, helping = false;
var buttons = new Array();
var title = new Image();
var username = "";
title.src = "images/title.fw.png";
buttons.push(new Button("startbutton1.fw.png", "startbutton2.fw.png",250, 140, 100, 50, "start"));
buttons.push(new Button("helpbutton1.png", "helpbutton2.png", 250, 220, 100, 50, "help"));
var mouse = {
    x: 0,
    y: 0
};
//Cancel backspace
$(document).keydown(function(e) {
    if (e.keyCode === 8) {
        return false;
    }
});
$(document).ready(function(){
    canvas = doc.getElementById("canvas");
    ctx = canvas.getContext("2d");
$("#canvas").mousemove(function(e){
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
});
function menuLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!start) {
    ctx.drawImage(title, canvas.width / 2 - title.width / 2, 50);
    for (b in buttons) {
     buttons[b].Draw();
     if (buttons[b].collide(mouse)) {
        canvas.setAttribute("style", "cursor:pointer");
        buttons[b].Sprite.src = buttons[b].res2;
        if (buttons[b].action === "start") {
        window.addEventListener("click", startGame, false);
        }
        if (buttons[b].action === "help") {       
        window.addEventListener("click", help, false);
        }   
    }
    else {      
        buttons[b].Sprite.src = buttons[b].SpritePrev.src;
        if (buttons[b].action === "start") {
        canvas.setAttribute("style", "cursor:default");
        window.removeEventListener("click", startGame, false);
        }      
        if (buttons[b].action === "help") {
        window.removeEventListener("click", help, false);
        }      
    }
    }
    ctx.fillStyle = "#333";
    ctx.fillRect(canvas.width / 2 - canvas.width / 2, canvas.height / 2 + 124, canvas.width, 20);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "18px Arial";
    ctx.fillText("Enter your name to be entered into the leaderboard:", canvas.width / 2, canvas.height / 2 + 100);
    ctx.fillText(username, canvas.width / 2, canvas.height / 2 + 140);
    setTimeout(menuLoop, 1000 / 30);
    }
    else {
        load();
    }
}
menuLoop();
});
function Button(res, res2, x, y, w, h, action) {
this.SpritePrev = new Image();
this.SpritePrev.src = "images/" + res;
this.Sprite = new Image();
this.Sprite.src = "images/" + res;
this.res2 = "images/"+res2;
this.x = x;
this.y = y;
this.width = w;
this.height = h;
this.action = action;
this.collide = function(obj) {
    if (obj.x < this.x) return false;
    if (obj.x > this.x + this.width) return false;
    if (obj.y < this.y) return false;
    if (obj.y > this.y + this.height) return false;
    return true;
};
}
Button.prototype.Draw = function() {
    ctx.drawImage(this.Sprite, this.x, this.y);
};
function startGame() {
    debug("start");
    start = true;
    canvas.setAttribute("style", "cursor:default");
}
function help() {
    debug("help");
    help = true;
}