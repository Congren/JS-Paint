//Andrew Wang congrenw@andrew.cmu.edu Final Project
var objects=[]; //stores drawn objects
var undidStack=[];
var paintIcons = []; // An array to store the images
var selected = "pencil";
var currColor = "black";
var currFill = 255; 
var strokeSize = 5;
var borderSize = 1;
var mouseClicks = 0;
var rectangles = [];
var mouseDownX = 0;
var mouseDownY = 0;
var mouseUpX = 0;
var mouseUpY = 0;
var txts = '';

function preload(){
    //loads the images and puts them into paintIcons
    var filenames = [];
    filenames[0] = "line.png";
    filenames[1] = "pencil.png";
    filenames[2] = "eraser.png";
    filenames[3] = "circle.png";
    filenames[4] = "text.png";
    filenames[5] = "square.png";
    for(var i=0; i<filenames.length; i++){
        paintIcons.push(loadImage(filenames[i]));
    }
}

function setup() {
    createCanvas(800, 800);  
    noStroke();
}

function draw() {
    background(255);
    //creates new pencil points and draws all objects
    createPoints();
    drawObjects();
    
    push();    
    //Creates trackers for drawing
    eraserTracker();
    rectangleTracker();
    lineTracker();
    textTracker();
    circleTracker();
    //draws the sidebar menu
    drawSelection();
    
    pop();
    //draws the images onto the sidebar
    drawImages();
}

function createPoints(){
    //creates points when the user draws with pencil or eraser
    if(mouseIsPressed && !(mouseX<=60 && mouseY<=400)){
        if (selected=="pencil" || selected=="eraser"){
            point = makePoint(mouseX, mouseY, currColor, strokeSize);
            objects.push(point);
        }
    }
}

function drawObjects(){
    //draws all the objects in the object array
    for(i=0; i<objects.length; i++){
        push();
        objects[i].draw();
        pop();
    }
}

function eraserTracker(){
    //creates mock eraser
    if(selected == "eraser"){
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(mouseX,mouseY,strokeSize,strokeSize);
    }
}

function lineTracker(){
    //creates mock line
    if(selected == "line"){
        if (mouseClicks%2==1){
            strokeWeight(strokeSize);
            line(mouseDownX, mouseDownY, mouseX, mouseY);      
        }
    }
}

function rectangleTracker(){
    //creates mock rectangle
    if(selected == "rectangle"){
        if (mouseClicks%2==1){
            fill(currFill);
            rect(mouseDownX, mouseDownY, mouseX-mouseDownX, mouseY-mouseDownY);      
        }
    }
}

function circleTracker(){
    //creates mock circle
    if(selected == "circle"){
        if (mouseClicks%2==1){
            fill(currFill);
            ellipseMode(CORNERS);
            ellipse(mouseDownX, mouseDownY, mouseX, mouseY);      
        }
    }
}

function textTracker(){
    //creates mock text
    if(selected == "text"){
        fill(currColor);
        textAlign(CENTER);
        textSize(strokeSize);
        text(txts, mouseX, mouseY);
    }
}

function drawImages(){
    //draws images
    image(paintIcons[1], 5, 10, 50, 45);
    image(paintIcons[2], 5, 70, 50, 50);
    image(paintIcons[3], 0, 200, 60, 60);
    image(paintIcons[4], 5, 140, 50, 40);
    image(paintIcons[5], 5, 275, 50, 50);
    image(paintIcons[0], 0, 335, 60, 60);
}

function drawSelection(){
    //draws the area for the images
    noStroke();
    fill(220);
    rect(0,0,60,400);
    fill(244);
    switch(selected){
        case "pencil":
            rect(0,0,60,65);
            break;
        case "eraser":
            rect(0,65,60,60);
            break;
        case "text":
            rect(0,125,60,67.5);
            break;
        case "circle":
            rect(0,192.5,60,72.5);
            break;
        case "rectangle":
            rect(0,265,60,70);
            break;
        case "line":
            rect(0,335,60,65);
            break;
    }
}
function mouseClicked() {
    //if the user creates new objects the redo option is reset
    if(mouseIsPressed && !(mouseX<=60 && mouseY<=400)){
        undidStack = [];
    }
    //functionality for clicking the sidebar images
    handleSidebar();
}

function handleSidebar(){
    if(mouseX<=60){
        //asks users to input the properties they would like for each option
        if(mouseY<=65){
            selected = "pencil";
            currColor = prompt("Stroke Color?") || "black";
            strokeSize = prompt("Pencil Size?") || 16;
            strokeWeight(strokeSize);           
            stroke(currColor);
        }else if(mouseY <= 125 && mouseY > 65){
            selected = "eraser";
            strokeSize = prompt("Eraser Size?") || 16;
            strokeWeight(strokeSize);
            stroke(255);
            currColor = 255;
        }else if(mouseY <= 192.5 && mouseY > 125){
            selected = "text";
            txts = prompt("What would you like to write?") || "";
            currColor = prompt("Text Color?") || "black";
            strokeSize = prompt("Text Size?") || 16;
        }else if(mouseY <= 265 && mouseY > 192.5){
            selected = "circle";
            mouseClicks = 0;
            currFill = prompt("Color?") || "black";
            fill(currFill);
            noStroke();
        }else if(mouseY <= 335 && mouseY > 265){
            selected = "rectangle";
            mouseClicks = 0;
            currFill = prompt("Color?") || "black";
            fill(currFill);
            noStroke();
        }else if(mouseY <= 405 && mouseY > 335){
            mouseClicks = 0;
            selected = "line";
            currColor = prompt("Line Color?") || "black";
            strokeSize = prompt("Line Size?") || "3";
            fill(currFill);
            stroke(currColor);
        }
    }
}

function keyPressed(){
    //handles redo, undo, and save functions
    push();
    redoUndo();
    saveImage();
    pop();
}

function redoUndo(){
    //"undos" an action by popping it from the objects array. temp holds it in the undidStack
    if ((key=="z" || key=="Z") && objects.length>0){
        undid = objects.pop();
        undidStack.push(undid);
    //redos when the user presses y and if they didnt draw anything else
    }else if ((key == "y" || key == "Y") && undidStack.length>0){
        redo = undidStack.pop();
        objects.push(redo);
    }
}

function saveImage(){
    //saves canvas as myPicture
    if (key=="s" || key=="S"){
        //removes the options bar when saved
        fill(255);
        noStroke();
        rect(0,0,60,400);
        saveCanvas(canvas,"myPicture",'png');
    }
}
    
function mousePressed() {
    //handles rectangle, line, text, and circle creation
    if(mouseIsPressed && !(mouseX<=60 && mouseY<=400)){
        createRectangle();
        createLine(); 
        createText();
        createCircle();
    }
}

function createRectangle(){
    if(selected == "rectangle"){
        //increments mouseclick
        mouseClicks+=1;
        //sets mousedownx and y
        if (mouseClicks%2!=0){
            mouseDownX = mouseX;
            mouseDownY = mouseY;
        }else{
            //sets mouseupx and y
            mouseUpX = mouseX;
            mouseUpY = mouseY;
            //sets boxw and boxh, absolute values not needed
            boxW = mouseUpX - mouseDownX;
            boxH = mouseUpY - mouseDownY;
            newBox = new makeBox(mouseDownX, mouseDownY, currFill)    
            //pushes to objects array
            newBox.w = boxW;
            newBox.h = boxH;
            objects.push(newBox);
        }
    }
}

function createLine(){
    if (selected == "line"){
        mouseClicks+=1;
        if (mouseClicks%2!=0){
            mouseDownX = mouseX;
            mouseDownY = mouseY;
        }else{
            //sets mouseupx and y
            mouseUpX = mouseX;
            mouseUpY = mouseY;
            //creates line with user inputted values
            newLine = new makeLine(mouseDownX, mouseDownY, mouseUpX, mouseUpY, currColor, strokeSize)    
            //pushes to objects array
            objects.push(newLine);
        }
    }
}

function createText(){
    //creates text object at mouse click position and adds to objects array
    if (selected == "text"){
        newText = makeText(mouseX, mouseY, currColor, strokeSize, txts)
        objects.push(newText);
    }
}

function createCircle(){
    if (selected == "circle"){
        mouseClicks+=1;
        if (mouseClicks%2!=0){
            mouseDownX = mouseX;
            mouseDownY = mouseY;
        }else{
            //sets mouseupx and y
            mouseUpX = mouseX;
            mouseUpY = mouseY;
            newCircle = new makeCircle(mouseDownX, mouseDownY, mouseUpX, mouseUpY, currFill)    
            //pushes to objects array
            objects.push(newCircle);
        }
    }
}

//point object
function makePoint(px, py, c, s) {
    var point={x:px,
               y:py,
               strokeSize: s,
               color: c,
               draw: drawPoint
              }
    return point;
}

//draws point using point object specs
function drawPoint() {
    push();
    noStroke();
    fill(String(this.color));
    ellipse(this.x, this.y, this.strokeSize, this.strokeSize);
    pop();
}

//text object
function makeText(px, py, textColor, textSize, words) {
    var word={x: px,
              y: py,
              color: textColor,
              size: textSize,
              draw: drawText,
              txt: words
            }
    return word;
}

//draws text using text object specs
function drawText() {
    push();
    textAlign(CENTER);
    fill(this.color);
    textSize(this.size);
    text(this.txt, this.x, this.y);
    pop();
}

//rectangle object
function makeBox(px, py, filler) {
    var box={x: px,
             y: py,
             w: 0,
             h: 0,
             c: filler,
             draw: drawBox
            }
    return box;
}

//draws rectangle based on rectangle specs
function drawBox() {
    push();
    noStroke();
    fill(String(this.c));
    rect(this.x, this.y, this.w, this.h);
    pop();
}

//circle object
function makeCircle(px, py, px2, py2, filler) {
    var circle={x: px,
                y: py,
                x2: px2,
                y2: py2,
                c: filler,
                draw: drawCircle
                }
    return circle;
}

//draws circle based on circle specs
function drawCircle() {
    push();
    noStroke();
    ellipseMode(CORNERS);
    fill(String(this.c));
    ellipse(this.x, this.y, this.x2, this.y2);
    pop();
}

//line object
function makeLine(px, py, px2, py2, filler, size) {
    var line={x: px,
              y: py,
              x2: px2,
              y2: py2,
              c: filler,
              sSize: size,
              draw: drawLine
             }
    return line;

}

//draws line based on line specs
function drawLine() {
    push();
    stroke(String(this.c));
    strokeWeight(this.sSize);
    line(this.x, this.y, this.x2, this.y2);
    pop();
}



