"use strict";

// const resizeHandle = document.getElementById("resize-handle");
const add = document.getElementById("add");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// let mouseDownX = 0;
// let mouseDownY = 0;

const containerList = [];

const margin = 10;

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
  return {x:x,y:y};
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

    const borderX = x - margin;
    const borderY = y - margin;

    const borderWidth = width + (2 * margin);
    const borderHeight = height + (2 * margin);

    this.border = new Border(borderX, borderY, borderWidth, borderHeight);

    const resizeHandleSide = 10;

    const resizeHandleX = (this.border.x + this.border.width) - (resizeHandleSide/2);
    const resizeHandleY = (this.border.y + this.border.height) - (resizeHandleSide/2); 

    this.resizeHandle = new ResizeHandle(resizeHandleX, resizeHandleY, resizeHandleSide, resizeHandleSide);
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

class ResizeHandle {
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

  context.fillStyle = "rgb(200, 23, 0)";
  context.fillRect(container.x, container.y , container.width, container.height);

  //console.log(container.x , container.y);
});

function changeContainerPropertiesAndDrawContainer(container) {

  //draw the object
  context.fillStyle = "rgb(200, 23, 0)";
  context.fillRect(container.x , container.y, container.width, container.height);

  //calculate the new border
  container.border.x = container.x - margin;
  container.border.y = container.y - margin;

  container.border.width = container.width + (2 * margin);
  container.border.height = container.height + (2 * margin);

  const border = container.border;

  //draw the border
  context.strokeStyle = "green";
  context.strokeRect(border.x , border.y, border.width, border.height);

  const resizeHandleSide = 10;
  //calculate the new resize handle co ordinates
  container.resizeHandle.x = (border.x + border.width) - (resizeHandleSide/2);
  container.resizeHandle.y = (border.y + border.height) - (resizeHandleSide/2); 

  const resizeHandle = container.resizeHandle;

  //draw the new resize handle
  context.fillStyle = "blue";
  context.fillRect(resizeHandle.x, resizeHandle.y, resizeHandleSide, resizeHandleSide);

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

    }
    
    else {
      //container.isSelected = false;

      //draw the object
      context.fillStyle = "rgb(200, 23, 0)";
      context.fillRect(container.x , container.y, container.width, container.height);

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

        //draw the object
        context.fillStyle = "rgb(200, 23, 0)";
        context.fillRect(container.x , container.y, container.width, container.height);

        container.border.x = container.x - margin;
        container.border.y = container.y - margin;

        container.border.width = container.width + (2 * margin);
        container.border.height = container.height + (2 * margin);

        const border = container.border;
    
        //draw the border 
        context.strokeStyle = "green";
        context.strokeRect(border.x , border.y, border.width, border.height);

        const resizeHandleSide = 10;

        const resizeHandleX = (border.x + border.width) - (resizeHandleSide/2);
        const resizeHandleY = (border.y + border.height) - (resizeHandleSide/2); 

        //draw the resize handle
        context.fillStyle = "blue";
        context.fillRect(resizeHandleX, resizeHandleY, resizeHandleSide, resizeHandleSide);

      }

      else {

        //draw the object
        context.fillStyle = "rgb(200, 23, 0)";
        context.fillRect(container.x , container.y, container.width, container.height);

        container.border.x = container.x - margin;
        container.border.y = container.y - margin;

        container.border.width = container.width + (2 * margin);
        container.border.height = container.height + (2 * margin);

        const border = container.border;
    
        //draw the border 
        context.strokeStyle = "green";
        context.strokeRect(border.x , border.y, border.width, border.height);

        const resizeHandleSide = 10;

        const resizeHandleX = (border.x + border.width) - (resizeHandleSide/2);
        const resizeHandleY = (border.y + border.height) - (resizeHandleSide/2) ; 

        //draw the resize handle
        context.fillStyle = "blue";
        context.fillRect(resizeHandleX, resizeHandleY, 10, 10);

      }

    }

    else {
      context.fillStyle = "rgb(200, 23, 0)";
      context.fillRect(container.x , container.y, container.width, container.height);
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

      //draw the object
      context.fillStyle = "rgb(200, 23, 0)";
      context.fillRect(container.x , container.y, container.width, container.height);

      container.border.x = container.x - margin;
      container.border.y = container.y - margin;

      container.border.width = container.width + (2 * margin);
      container.border.height = container.height + (2 * margin);

      const border = container.border;

      //draw the border 
      context.strokeStyle = "green";
      context.strokeRect(border.x , border.y, border.width, border.height);

      const resizeHandleSide = 10;

      const resizeHandleX = (border.x + border.width) - (resizeHandleSide/2);
      const resizeHandleY = (border.y + border.height) - (resizeHandleSide/2) ; 

      //draw the resize handle
      context.fillStyle = "blue";
      context.fillRect(resizeHandleX, resizeHandleY, 10, 10);

    }

    else {
      context.fillStyle = "rgb(200, 23, 0)";
      context.fillRect(container.x , container.y, container.width, container.height);
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





