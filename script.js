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

const img = new Image();        
// img.src = './cat.jpg';    

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

class Container {

  constructor(x, y, width, height, src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSelected = false;
    this.isDraggable = true;
    this.isResizable = false;
    this.isRotatable = false;

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

class Text extends Container {
  constructor(text) {
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

add.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    img.src = reader.result;

    let imageWidth = img.width;
    let imageHeight = img.height;

    let newImageWidth = 100;
    let newImageHeight = (newImageWidth * imageHeight) / imageWidth;

    // const image = Image();
    // image.src = reader.result;
    //open image selector
    let container = new Container(canvas.width/2, canvas.height/2, newImageWidth, newImageHeight, reader.result);

    containerList.push(container);

    context.fillStyle = red;
    context.fillRect(container.x, container.y , container.width, container.height);
  });

  if (selectedFile) {
    reader.readAsDataURL(selectedFile);
  }




});

// add.addEventListener("click", (event) => {

//   // img.src = './cat.jpg';  
  
//   img.src = './C:/Users/ZIDAN-PC/Desktop/image.jpg';



//   img.onload = () => {

//       //open image selector
//     let container = new Container(canvas.width/2, canvas.height/2, img.width, img.height, "cat.jpg");

//     containerList.push(container);

//     context.fillStyle = red;
//     context.fillRect(container.x, container.y , container.width, container.height);

//   }

// });

function changeContainerPropertiesAndDrawContainer(container) {

  // if(container.rotation > 0) {
  //   drawRotatedContainer(container)
  // }
  // else {
  //   drawSelectedContainer(container);
  // }

  drawRotatedContainer(container)

}

function drawUnselectedContainer(container) {

    // let previousX = container.x;
    // let previousY = container.y;

    context.setTransform(1, 0, 0, 1, 0, 0);
    // context.save()

    let deg = container.rotation;

    //Convert degrees to radian 
    let rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    context.translate(container.x + container.width / 2, container.y + container.height / 2);

    //Rotate the canvas around the origin
    context.rotate(container.rotation);

    // context.fillStyle = "black";
    // context.fillRect(0, 0 , canvasWidth, documentHeight);

    context.translate(-(container.x + container.width / 2), -(container.y + container.height / 2));

    //draw the object
    context.fillStyle = red;
    context.fillRect(container.x , container.y, container.width, container.height);

        // img.onload = () => {          context.drawImage(img, 0, 0);        };

    context.drawImage(container.image, container.x, container.y, container.width, container.height);

    context.setTransform(1, 0, 0, 1, 0, 0);

    // Restore canvas state as saved from above
    // context.restore();

    // container.x = previousX;
    // container.y = previousY;

}

function drawRotatedContainer(container) { 


  // let previousX = container.x;
  // let previousY = container.y;

  context.setTransform(1, 0, 0, 1, 0, 0);
  // context.save()

  let deg = container.rotation;

  //Convert degrees to radian 
  let rad = deg * Math.PI / 180;

  //Set the origin to the center of the image
  context.translate(container.x + container.width / 2, container.y + container.height / 2);

  //Rotate the canvas around the origin
  context.rotate(container.rotation);

  // context.fillStyle = "black";
  // context.fillRect(0, 0 , canvasWidth, documentHeight);

  context.translate(-(container.x + container.width / 2), -(container.y + container.height / 2));

  drawSelectedContainer(container);

  context.setTransform(1, 0, 0, 1, 0, 0);

  // Restore canvas state as saved from above
  // context.restore();

  context.strokeStyle = "black";
  context.strokeRect(container.x, container.y, container.width, container.height);

  // container.x = previousX;
  // container.y = previousY;

}

function drawSelectedContainer(container) {

  //draw the object
  context.fillStyle = red;
  context.fillRect(container.x , container.y, container.width, container.height);

  context.drawImage(container.image, container.x, container.y, container.width, container.height);

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
      container.isDraggable = true;

      changeContainerPropertiesAndDrawContainer(container);

      
    }

    else if(container.resizeHandle.isPointInsideContainer(mouseDownX, mouseDownY)) {

      console.log("container is resizable");

      container.isResizable = true;

      changeContainerPropertiesAndDrawContainer(container);
      

    }

    else if(container.rotateHandle.isPointInsideContainer(mouseDownX, mouseDownY)) {

      console.log("rotatable");
      // container.rotation += 30;

      container.isRotatable = true;

      drawSelectedContainer(container);

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

      if((mouseDownX !== mouseMoveX || mouseDownY !== mouseMoveY) && container.isDraggable && isMouseDown) { // && container.isPointInsideContainer(mouseMoveX, mouseMoveY) && isMouseDown) {

        console.log("container is draggable");

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

        let ratio = container.width/container.height;

        const updatedWidth = mouseMoveX - container.x - (margin * 2);
        const updatedHeight = (updatedWidth * container.height)/container.width;//mouseMoveY - container.y - (margin * 2) ;

        console.log(updatedHeight);

        container.width = updatedWidth;
        container.height = updatedHeight;

        changeContainerPropertiesAndDrawContainer(container);

      }

      else if(container.isRotatable && isMouseDown) {

        //container.rotation = -90; //container.rotation + 1;

        let centerX = container.x + container.width / 2;
        let centerY = container.y + container.height / 2

        let deltaX = mouseMoveX - centerX;
        let deltaY = mouseMoveY - centerY;
        let radians = Math.atan2(deltaY, deltaX)
        let degrees = ((radians * 180) / Math.PI);
        degrees  = (degrees + 360) % 360;
        // if (true) {
        //   degrees  = (degrees + 360) % 360;
        // }
        console.log('angle to degree:',{deltaX,deltaY,radians,degrees})

        container.rotation = radians;


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

    container.isResizable = false;
    container.isRotatable = false;
    container.isDraggable = false;
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





