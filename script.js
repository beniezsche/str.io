"use strict";

const add = document.getElementById("add");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const containerList = [];

const margin = 10;

const red = "#E74C3C";
const green = "#2ECC71";
const blue = "#3498DB";

const documentHeight = document.documentElement.clientHeight;
const documentWidth = document.documentElement.clientWidth;

const canvasWidth = (9/16) * documentHeight;

canvas.width = canvasWidth;
canvas.height = documentHeight;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {x:x,
          y:y};
}

class Container {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSelected = false;
    this.isDragging = false;
    this.isResizable = false;
    this.isRotatable = false;

    this.rotation = 0;

    const borderX = x - margin;
    const borderY = y - margin;

    const borderWidth = width + (2 * margin);
    const borderHeight = height + (2 * margin);

    this.border = new Border(borderX, borderY, borderWidth, borderHeight);

    const resizeHandleSide = 10;

    const resizeHandleX = (this.border.x + this.border.width) - (resizeHandleSide/2);
    const resizeHandleY = (this.border.y + this.border.height) - (resizeHandleSide/2); 

    this.resizeHandle = new Handle(resizeHandleX, resizeHandleY, resizeHandleSide, resizeHandleSide);

    const midpointXBottom = this.border.x + (this.border.width/2) ;
    const midpointYBottom = this.border.y;

    const lineLength = 50;

    const midpointXTop = midpointXBottom;
    const midpointYTop = midpointYBottom - lineLength;

    const rotateHandleSide = 10;

    //calculate the new resize handle co ordinates
    const rotateHandleX = (midpointXTop) - (rotateHandleSide/2);
    const rotateHandleY = (midpointYTop ) - (rotateHandleSide/2); 

    this.rotateHandle = new Handle(rotateHandleX, rotateHandleY, resizeHandleSide, resizeHandleSide);
  }

  isPointInsideContainer(x, y) {

    if(x > 0 && y > 0 && x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {

      // console.log(x > 0);
      // console.log(y > 0);

      // console.log(x > this.x);
      // console.log(x < (this.x + this.width));

      
      // console.log(y > this.y);
      // console.log(y < (this.y + this.height));
      
      return true;
    }

    return false;
  }
}

class Handle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isPointInsideContainer(x, y) {

    if(x > 0 && y > 0 && x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {

      // console.log(x > 0);
      // console.log(y > 0);

      // console.log(x > this.x);
      // console.log(x < (this.x + this.width));

      
      // console.log(y > this.y);
      // console.log(y < (this.y + this.height));
      
      return true;
    }

    return false;
  }


}

class Border {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  createBorder() {

  }

}


add.addEventListener("click", (event) => {

  //open image selector
  let container = new Container(canvas.width/2, canvas.height/2, 70, 40);

  containerList.push(container);

  context.fillStyle = red;
  context.fillRect(container.x, container.y , container.width, container.height);

  //console.log(container.x , container.y);
});

function changeContainerPropertiesAndDrawContainer(container) {

  if(container.rotation > 0) {
    drawRotatedContainer(container)
  }
  else {
    drawSelectedContainer(container);
  }

}

function drawUnselectedContainer(container) {

    //draw the object
    context.fillStyle = red;
    context.fillRect(container.x , container.y, container.width, container.height);

}

function drawRotatedContainer(container) { 


  let previousX = container.x;
  let previousY = container.y;

  // context.setTransform(1, 0, 0, 1, 0, 0);
  context.save()

  let deg = container.rotation;

  //Convert degrees to radian 
  let rad = deg * Math.PI / 180;

  //Set the origin to the center of the image
  context.translate(container.x + container.width / 2, container.y + container.height / 2);

  context.fillStyle = "black";
  context.fillRect(0, 0 , canvasWidth, documentHeight);

  // container.x = -((container.width) / 2);
  // container.y = -((container.height) / 2);

  //Rotate the canvas around the origin
  context.rotate(rad);

  context.translate(-(container.x + container.width / 2), -(container.y + container.height / 2));

  drawSelectedContainer(container);

  // context.setTransform(1, 0, 0, 1, 0, 0);

  // Restore canvas state as saved from above
  context.restore();

  container.x = previousX;
  container.y = previousY;

}

function drawSelectedContainer(container) {

  //draw the object
  context.fillStyle = red;
  context.fillRect(container.x , container.y, container.width, container.height);

  //calculate the border
  container.border.x = container.x - margin;
  container.border.y = container.y - margin;

  container.border.width = container.width + (2 * margin);
  container.border.height = container.height + (2 * margin);

  const border = container.border;

  //draw the border
  context.strokeStyle = green;
  context.strokeRect(border.x , border.y, border.width, border.height);

  const resizeHandleSide = 10;
  //calculate the new resize handle co ordinates
  container.resizeHandle.x = (border.x + border.width) - (resizeHandleSide/2);
  container.resizeHandle.y = (border.y + border.height) - (resizeHandleSide/2); 

  const resizeHandle = container.resizeHandle;

  //draw the new resize handle
  context.fillStyle = blue;
  context.fillRect(resizeHandle.x, resizeHandle.y, resizeHandleSide, resizeHandleSide);


  //calculate midpoint of width

  const midpointXBottom = container.border.x + (container.border.width/2) ;
  const midpointYBottom = container.border.y;

  const lineLength = 50;

  const midpointXTop = midpointXBottom;
  const midpointYTop = container.border.y - lineLength;

  const rotateHandleSide = 10;
  //calculate the new rotate handle co ordinates
  const rotateHandleX = (midpointXTop) - (rotateHandleSide/2);
  const rotateHandleY = (midpointYTop) - (rotateHandleSide/2); 

  // console.log(midpointX + ", " + midpointY);

  container.rotateHandle.x = rotateHandleX;
  container.rotateHandle.y = rotateHandleY;

  container.rotateHandle.width = rotateHandleSide;
  container.rotateHandle.height = rotateHandleSide;

  // context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(midpointXBottom, midpointYBottom);
  context.lineTo(midpointXTop, midpointYTop);
  context.stroke();


  //draw the new rotate handle
  context.fillStyle = blue;
  context.fillRect(rotateHandleX, rotateHandleY, rotateHandleSide, rotateHandleSide);

}

let mouseDownX = 0;
let mouseDownY = 0;

let isMouseDown = false;

canvas.addEventListener("mousedown", (event) => {

  clearCanvas();

  // console.log("mouse down");

  isMouseDown = true;

  mouseDownX = getCursorPosition(canvas, event).x;
  mouseDownY = getCursorPosition(canvas, event).y;

  // console.log("mouseDownX: " + mouseDownX + ", " +  "mouseDownY: " + mouseDownY);

  for (const container of containerList) {

    console.log(container.border.x + ", " + container.border.y + ", " + container.border.width + ", " + container.border.height);
    console.log(container.x + ", " + container.y + ", " + container.width + ", " + container.height);

    if(container.isPointInsideContainer(mouseDownX, mouseDownY)) {
      // console.log("container is selected");
      container.isSelected = true;

      changeContainerPropertiesAndDrawContainer(container);

      
    }

    else if(container.resizeHandle.isPointInsideContainer(mouseDownX, mouseDownY)) {

      console.log("container is resizable");

      container.isResizable = true;

      changeContainerPropertiesAndDrawContainer(container);
      

    }

    else if(container.rotateHandle.isPointInsideContainer(mouseDownX, mouseDownY)) {

      console.log("rotatable");
      container.rotation += 60;

      drawRotatedContainer(container);

    }
    
    else {
      container.isSelected = false;

      drawUnselectedContainer(container);


    }

  }

});

canvas.addEventListener("mousemove", (event) => {

  clearCanvas();

  let mouseMoveX = getCursorPosition(canvas, event).x; 
  let mouseMoveY = getCursorPosition(canvas, event).y;

  for (const container of containerList) {

    // console.log((mouseDownX != mouseMoveX || mouseDownY != mouseMoveY) && container.isSelected);
    // console.log("isDragging:" + container.isDragging); 

    if (container.isSelected) {

      if((mouseDownX !== mouseMoveX || mouseDownY !== mouseMoveY) && container.isPointInsideContainer(mouseMoveX, mouseMoveY) && isMouseDown) {

        console.log("container is draggable");

        container.isDragging = true;

        const updatedContainerPositionX = mouseMoveX  - (container.width/2) ;
        const updatedContainerPositionY = mouseMoveY - (container.height/2) ;

        container.x = updatedContainerPositionX;
        container.y = updatedContainerPositionY;

        changeContainerPropertiesAndDrawContainer(container);

      }

      else if (container.isResizable && isMouseDown) {

        console.log("container is resizing");
        // container.isDragging = false;


        //console.log("container.height: " + container.height + " + diffY: " + diffY + " total = " + (container.height + diffY));

        const updatedWidth = mouseMoveX - container.x - (margin * 2);
        const updatedHeight = mouseMoveY - container.y - (margin * 2) ;

        console.log(updatedHeight);

        container.width = updatedWidth;
        container.height = updatedHeight;

        changeContainerPropertiesAndDrawContainer(container);

      }

      else {

        changeContainerPropertiesAndDrawContainer(container);

      }

    }

    else {
      drawUnselectedContainer(container);
    }
  
  }
  
});

canvas.addEventListener("mouseup", (event) => {

  clearCanvas();

  console.log("mouse up");

  isMouseDown = false;

  for(const container of containerList) {

    container.isDragging = false;
    container.isResizable = false;
    // container.isSelected = false;

    if (container.isSelected) {
      changeContainerPropertiesAndDrawContainer(container);
    }

    else {
      drawUnselectedContainer(container);
    }
   
  }
});

let rect = {
  x: 0,
  y: 0,
};

window.addEventListener("load", (event) => {
  draw();
});

function draw() {
  if (canvas.getContext) {

  }
}





