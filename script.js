"use strict";

const add = document.getElementById("add");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const canvas = document.getElementById("canvas");
const backgroundColourPicker = document.getElementById("background");
const context = canvas.getContext("2d");

const containerList = [];

const margin = 10;

const red = "#E74C3C";
const green = "#2ECC71";
const blue = "#3498DB";

let backgroundColour = "#FFFFE0";

const documentHeight = document.documentElement.clientHeight;
const documentWidth = document.documentElement.clientWidth;


const canvasHeight = documentHeight;
const canvasWidth = documentWidth; //(9/16) * documentHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {x:x,
          y:y};
}

document.addEventListener('keydown', (event) => {

  if(event.key === "Backspace" || 
      event.key === "Enter" || 
      event.key === "Shift" ||
      event.key === "Control" ||
      event.key === "Alt")
    return;

  for(let container of containerList) {
    if(container instanceof TextContainer && container.isSelected) {
      container.text = container.text + event.key;

      const newWidth = context.measureText(container.text).width;
      console.log(newWidth);
      container.width = newWidth; 
    }
  }

  drawContainers();
});

class Container {

  constructor(x, y, width, height, src, zIndex) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSelected = false;
    this.isDraggable = true;
    this.isResizable = false;
    this.isRotatable = false;

    this.zIndex = zIndex;

    this.image = new Image();
    this.image.src = src

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

    const deleteHandleSize = 10;

    const deleteHandleX = (this.border.x + this.border.width) - (deleteHandleSize/2);
    const deleteHandleY = (this.border.y) - (deleteHandleSize/2); 

    this.deleteHandle = new Handle(deleteHandleX, deleteHandleY, deleteHandleSize, deleteHandleSize);
  }

  isPointInsideRotatedContainer(x,y) {

    const a = -this.rotation

    const diffX = x - (this.x + this.width / 2);
    const diffY = y - (this.y + this.height / 2);

    //Rotate the canvas around the origin
    const unrotatedX = (diffX * Math.cos(a) - diffY * Math.sin(a)) ;
    const unrotatedY = (diffX * Math.sin(a) + diffY * Math.cos(a)) ;

    const newDiffX = (this.x + this.width / 2) + unrotatedX;
    const newDiffY = (this.y + this.height / 2) + unrotatedY;

    const isPointInsideContainer = this.isPointInsideContainer(newDiffX, newDiffY);

    return isPointInsideContainer
  }

  isPointInsideContainer(x, y) {

    if(x > 0 && y > 0 && x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
      return true;
    }

    return false;
  }
}

class TextContainer extends Container {
  constructor(x, y, width, height, src, zIndex, text) {
    super(x, y, width, height, src, zIndex);
    this.text = text;
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
}

const reader = new FileReader();
const img = new Image();

fileInput.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];
  
  if (selectedFile) {
    reader.readAsDataURL(selectedFile);
  }
});

reader.addEventListener('load', (event) => {
  img.src = event.target.result;
});

img.addEventListener('load', () => {

  const imageWidth = img.width;
  const imageHeight = img.height;

  const newImageWidth = 100;
  const newImageHeight = (newImageWidth * imageHeight) / imageWidth;

  const container = new Container(canvas.width/2, canvas.height/2, newImageWidth, newImageHeight, reader.result, containerList.size);
  containerList.push(container);


  drawContainers();
});

textInput.addEventListener('click', function() {

  let textPrompt = prompt("Please some text", "");
  if (textPrompt != null) {
    const text = new TextContainer(canvas.width/2, canvas.height/2, 100, 20, undefined ,containerList.size, textPrompt);
    containerList.push(text);
    
    drawContainers();
  }

});

document.getElementById("foo").addEventListener('change', (event) => {
  backgroundColour = document.getElementById("foo").value;
});

backgroundColourPicker.addEventListener('click', (event) => {

  document.getElementById("foo").jscolor.show();

});

function drawRotatedContainer(container) { 

  // context.setTransform(1, 0, 0, 1, 0, 0);

  let deg = container.rotation;

  //Convert degrees to radian 
  let rad = deg * Math.PI / 180;

  //Set the origin to the center of the image
  context.translate(container.x + container.width / 2, container.y + container.height / 2);

  //Rotate the canvas around the origin
  context.rotate(container.rotation);

  context.translate(-(container.x + container.width / 2), -(container.y + container.height / 2));

  if(container.isSelected) {
    drawSelectedContainer(container);
  }
  else {
    drawUnselectedContainer(container);
  }

  context.setTransform(1, 0, 0, 1, 0, 0);

}

const font =  "20px serif";

function drawUnselectedContainer(container) {
  //draw the object
  context.fillStyle = red;
  // context.fillRect(container.x , container.y, container.width, container.height);

  if(container instanceof TextContainer) {
    context.font = font;
    context.textBaseline = "top";
    context.fillText(container.text, container.x, container.y);
  }
  else {
    context.drawImage(container.image, container.x, container.y, container.width, container.height);
  }

}

function drawSelectedContainer(container) {

  //draw the object
  context.fillStyle = red;
  // context.fillRect(container.x , container.y, container.width, container.height);

  if(container instanceof TextContainer) {
    context.font = font;
    context.textBaseline = "top";
    context.fillText(container.text, container.x, container.y);
  }
  else {
    context.drawImage(container.image, container.x, container.y, container.width, container.height);
  }


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

  const deleteHandleSide = 10;
  //calculate the new delete handle co ordinates
  container.deleteHandle.x = (border.x + border.width) - (deleteHandleSide/2);
  container.deleteHandle.y = (border.y) - (deleteHandleSide/2); 

  const deleteHandle = container.deleteHandle;

  //draw the new delete handle
  context.fillStyle = red;
  context.fillRect(deleteHandle.x, deleteHandle.y, deleteHandleSide, deleteHandleSide);

}

let mouseDownX = 0;
let mouseDownY = 0;

let isMouseDown = false;

let draggingDeltaX = 0;
let draggingDeltaY = 0;

function findIfPointInsideRotatedContainer(x, y, originX, originY, rotation, container) {

  const diffX = x - originX;
  const diffY = y - originY;

  //Rotate the canvas around the origin
  const unrotatedX = (diffX * Math.cos(-rotation) - diffY * Math.sin(-rotation));
  const unrotatedY = (diffX * Math.sin(-rotation) + diffY * Math.cos(-rotation));

  const newDiffX = originX + unrotatedX;
  const newDiffY = originY + unrotatedY;


  return findIfPointIsInsideContainer(newDiffX, newDiffY, container.x, container.y, container.width, container.height);

}

function findIfPointIsInsideContainer(testX, testY, x, y, width, height) {

  if(testX > 0 && testY > 0 && testX > x && testX < (x + width) && testY > y && testY < (y + height)) {
    return true;
  }

  return false;
}


canvas.addEventListener("mousedown", (event) => {

  clearCanvas();

  isMouseDown = true;

  mouseDownX = getCursorPosition(canvas, event).x;
  mouseDownY = getCursorPosition(canvas, event).y;

  let lastPos = 0;
  let selectedCount = 0;

  for (const [position,container] of containerList.entries()) {

    if(container.isPointInsideRotatedContainer(mouseDownX, mouseDownY)) {
      selectedCount++;
      lastPos = position
    }

    else if(findIfPointInsideRotatedContainer(mouseDownX, mouseDownY, container.x + container.width/2, container.y + container.height/2, container.rotation, container.resizeHandle)) { 
      container.isResizable = true;
    }

    else if(findIfPointInsideRotatedContainer(mouseDownX, mouseDownY, container.x + container.width/2, container.y + container.height/2, container.rotation, container.rotateHandle)) {
      container.isRotatable = true;
    }

    else if(findIfPointInsideRotatedContainer(mouseDownX, mouseDownY, container.x + container.width/2, container.y + container.height/2, container.rotation, container.deleteHandle)) {
      
      const confirmDelete = confirm("Are you sure you want to delete this image?");

      if(confirmDelete) {
        containerList.splice(position , 1);
      }
    }
    
    else {
      container.isSelected = false;
    }
  }

  if(selectedCount >= 1) {
    const elementToBeBroughtToTop = containerList[lastPos];

    containerList[lastPos].isSelected = true;
    containerList[lastPos].isDraggable = true;

    draggingDeltaX = mouseDownX - containerList[lastPos].x;
    draggingDeltaY = mouseDownY - containerList[lastPos].y;

    containerList.splice(lastPos, 1);
    containerList.splice(containerList.length, 1, elementToBeBroughtToTop);
  }


  drawContainers();

});

function drawContainers() {

  // containerList.sort((a, b) => a.zIndex - b.zIndex);
  context.fillStyle = backgroundColour;
  context.fillRect(0, 0, canvasWidth, documentHeight);


  for (const container of containerList) {
      drawRotatedContainer(container);
  }
}

canvas.addEventListener("mousemove", (event) => {

  clearCanvas();

  let mouseMoveX = getCursorPosition(canvas, event).x; 
  let mouseMoveY = getCursorPosition(canvas, event).y;

  for (const container of containerList) {

    if (container.isSelected) {

      if((mouseDownX !== mouseMoveX || mouseDownY !== mouseMoveY) && container.isDraggable && isMouseDown) { // && container.isPointInsideContainer(mouseMoveX, mouseMoveY) && isMouseDown) {

        const updatedContainerPositionX = mouseMoveX  - draggingDeltaX; 
        const updatedContainerPositionY = mouseMoveY - draggingDeltaY; 

        container.x = updatedContainerPositionX;
        container.y = updatedContainerPositionY;

      }

      else if (container.isResizable && isMouseDown) {

        let ratio = container.width/container.height;

        const updatedWidth = mouseMoveX - container.x - (margin * 2);
        const updatedHeight = (updatedWidth * container.height)/container.width;

        container.width = updatedWidth;
        container.height = updatedHeight;

      }

      else if(container.isRotatable && isMouseDown) {

        let centerX = container.x + container.width / 2;
        let centerY = container.y + container.height / 2;

        let deltaX = mouseMoveX - centerX;
        let deltaY = mouseMoveY - centerY;
        let radians =  Math.atan2(deltaY, deltaX) + (Math.PI/2)

        container.rotation = radians;

      }

      else {
        
      }
    }
  }

  drawContainers();
  
});

canvas.addEventListener("mouseup", (event) => {

  clearCanvas();

  isMouseDown = false;

  for(const container of containerList) {

    container.isResizable = false;
    container.isRotatable = false;
    container.isDraggable = false;


    draggingDeltaX = 0;
    draggingDeltaY = 0;
   
  }

  drawContainers();
});



