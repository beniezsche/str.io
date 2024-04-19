"use strict";

import Container from "./containers/container.js";
import createDialog from "./ui/dialog.js"

const add = document.getElementById("add");
const fileInput = document.getElementById("file");
const videoFileInput = document.getElementById("file-video")
const textInput = document.getElementById("text");
const canvas = document.getElementById("canvas");
const addTextButton = document.getElementById("add-text-button");
const addVideoButton = document.getElementById("video")
const closeModalButton = document.getElementById("close-modal-button");
const backgroundColourPicker = document.getElementById("background");
const context = canvas.getContext("2d");

const containerList = [];

const margin = 10;

const red = "#E74C3C";
const green = "#2ECC71";
const blue = "#3498DB";


let backgroundColour = "#FFFFFF";

const documentHeight = document.documentElement.clientHeight;
const documentWidth = document.documentElement.clientWidth;


const canvasHeight = documentHeight;
const canvasWidth = documentWidth; //(9/16) * documentHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let isTextEditMode = false;


// MODELS


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



class TextContainer extends Container {
  constructor(x, y, width, height, src, zIndex, text) {
    super(x, y, width, height, src, zIndex);
    this.text = text;
    this.isEditable = false;
    this.cursorPositionX = 0;
    this.cursorPositionY = 0;
  }
}

class VideoContainer extends Container {
  constructor(x,y,width,height,src, zIndex) {
    super(x, y, width, height, src, zIndex);

    this.isPlaying = false;
    this.currentFrame = 0;

  }
}

const reader = new FileReader();
const videoReader = new FileReader();
const img = new Image();

videoFileInput.addEventListener('change', (event) => {

  const selectedFile = event.target.files[0];
  
  if (selectedFile) {
    videoReader.readAsArrayBuffer(selectedFile);
  }
  
});

videoReader.addEventListener('load', (event) => {
  console.log(event.target.result);
});

addTextButton?.addEventListener('click', (event) => {
  submitText();
});

closeModalButton?.addEventListener('click', (event) => {
  closeModal();
});

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

let montserratBold = new FontFace("Montserrat", "url(assets/fonts/montserrat_700.ttf");
let shadowsIntoLightBold = new FontFace("Shadows-Into-Light-Regular", "url(assets/fonts/shadows_into_light_400.ttf"); 

const textSize = 25;

let font = null 

montserratBold.load().then((loadedFont) => {

  alert("Font loaded!")

  document.fonts.add(loadedFont)

  // console.log(loadedFont)

  font = textSize + "px Montserrat";
  
});



textInput.addEventListener('click', function() {


  // let textPrompt = prompt("Please add some text", ""); //"They decided to plant an orchard\nof cotton candy."; 
  // if (textPrompt != null) {

  //   context.font = font

  //   let metrics = context.measureText(textPrompt);
  //   let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  //   let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  //   const textWidth = metrics.width;

  //   console.log(metrics)
  //   console.log(actualHeight)
  //   console.log(textWidth)

  //   const text = new TextContainer(canvas.width/2, canvas.height/2, textWidth , textSize, undefined ,containerList.size, textPrompt);
  //   text.cursorPositionX = textPrompt.length;
  //   containerList.push(text);
    
  //   drawContainers();
  // }

  openModal();

});

// document.addEventListener('keydown', (event) => {

//   if(event.key === "Shift" ||
//      event.key === "Control" ||
//      event.key === "Alt")
//      return;

//   for(let container of containerList) {
//     if(container instanceof TextContainer && container.isSelected) {

//       container.isEditable = true;

//       const splitString = container.text.split("\n");
      
//       if(event.key === "Enter") {
        
//         container.text = container.text + "\n";
//         console.log(container.text);
//         container.cursorPositionY += 1;
//         container.cursorPositionX = 0;
//       }
//       else if (event.code === "Backspace") {
//         //implement deletion

//         let i = 0;
//         let totalLength = 0;

//         while(i < container.cursorPositionY) {
//           totalLength += splitString[i].length + 1;
//           i++;
//         }


//         //console.log(container.text.slice(0, container.cursorPositionX));
//         container.text = container.text.slice(0,totalLength + container.cursorPositionX - 1) + container.text.slice(totalLength + container.cursorPositionX, container.text.length);
//         container.cursorPositionX -= 1;
//       }
//       else if (event.code === "ArrowUp") {
//         container.cursorPositionY -= 1;
//       }
//       else if (event.code === "ArrowDown") {
//         container.cursorPositionY += 1; 
//       }
//       else if (event.code === "ArrowRight") {
//         container.cursorPositionX += 1;
//       }
//       else if(event.code === "ArrowLeft") {
//         container.cursorPositionX -= 1;
//       }
//       else {
//         console.log(event.key);

//         let i = 0;
//         let totalLength = 0;

//         while(i < container.cursorPositionY) {
//           totalLength += splitString[i].length + 1;
//           i++;
//         }

//         //console.log(container.text.slice(0, totalLength + container.cursorPositionX) + " + " +  event.key  + " + " + container.text.slice(totalLength + container.cursorPositionX, container.text.length));
//         container.text = container.text.slice(0, totalLength + container.cursorPositionX) + event.key + container.text.slice(totalLength + container.cursorPositionX, container.text.length);
//         container.cursorPositionX += 1;
//       }

//       const splitStringNew = container.text.split("\n");

//       let newWidth = container.width;

//       for(text of splitStringNew) {
//         const w = context.measureText(text).width;
//         if(w > newWidth)
//           newWidth = w;
//       }
      
//       console.log(newWidth);
//       container.width = newWidth; 

//       if(splitStringNew.length > 1) {
//         const newHeight = (textSize + (margin * 2)) * splitStringNew.length;
//         container.height = newHeight;
//       }
      

//     }
//   }

//   drawContainers();
// });

document.getElementById("foo").addEventListener('input', (event) => {
  backgroundColour = document.getElementById("foo").value;

  drawContainers();
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

function drawText(container) {
  context.font = font;
  context.textBaseline = "top";
  const splitStrings = container.text.split("\n");

  let y = container.y;

  if(splitStrings.length > 1) {

    for (let text of splitStrings) {

      context.fillText(text, container.x, y);
      y += textSize + 10;
    }

  }
  else {
    context.fillText(container.text, container.x, container.y);
  }



  if(container.isEditable) {

    // if(container.cursorPositionY > splitStrings.length - 1 || container.cursorPositionY < 0 )
    //   return;

    // const cursorPosX = context.measureText(splitStrings[container.cursorPositionY].slice(0,container.cursorPositionX)).width

    // context.fillStyle = "black"
    // context.fillRect(container.x + cursorPosX, (container.y) + ((textSize + 10 ) * container.cursorPositionY), 2 , textSize);
  }



  //context.fillText(container.text, container.x, container.y);
}

function drawUnselectedContainer(container) {
  //draw the object
  context.fillStyle = red;
  // context.fillRect(container.x , container.y, container.width, container.height);

  if(container instanceof TextContainer) {
    drawText(container)
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
    drawText(container)
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

let mousedownTimeStamp = 0;
let mouseupTimeStamp = 0;

function drawContainers() {

  // containerList.sort((a, b) => a.zIndex - b.zIndex);
  context.fillStyle = backgroundColour;
  context.fillRect(0, 0, canvasWidth, documentHeight);


  for (const container of containerList) {
      drawRotatedContainer(container);
  }
}

canvas.addEventListener("mousedown", (event) => {

  clearCanvas();

  isMouseDown = true;
  mousedownTimeStamp = Date.now();


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
      container.isEditable = false;
    }
  }

  if(selectedCount >= 1) {
    const elementToBeBroughtToTop = containerList[lastPos];

    containerList[lastPos].isSelected = true;
    containerList[lastPos].isDraggable = true;
    containerList[lastPos].isEditable = true;

    draggingDeltaX = mouseDownX - containerList[lastPos].x;
    draggingDeltaY = mouseDownY - containerList[lastPos].y;

    containerList.splice(lastPos, 1);
    containerList.splice(containerList.length, 1, elementToBeBroughtToTop);
  }


  drawContainers();

});

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

function openEditDialog(textItem) {
  const dialog = createDialog((text) => { 
                                          textItem.text = text;
                                          document.body.removeChild(dialog); 
                                          drawContainers();
                                        },
                              () => document.body.removeChild(dialog));
  document.body.appendChild(dialog);
  dialog.style.display = "flex";

  return dialog;
}


canvas.addEventListener("dblclick", (event) => {
  console.log("double click");

  const x = event.clientX;
  const y = event.clientY;

  for (let item of containerList) {

    if (item.isPointInsideRotatedContainer(x,y) && item instanceof TextContainer) {
      openEditDialog(item);
      document.getElementById("inputText").value = item.text;

      break;
    }

  }
});

canvas.addEventListener("mouseup", (event) => {

  clearCanvas();

  isMouseDown = false;
  mouseupTimeStamp = Date.now();


  for(const container of containerList) {

    container.isResizable = false;
    container.isRotatable = false;
    container.isDraggable = false;


    draggingDeltaX = 0;
    draggingDeltaY = 0;
   
  }

  drawContainers();
});

function openModal() {
  // document.getElementById("modalContainer").style.display = "flex";

  const dialog = createDialog((text) => { submitText(text); document.body.removeChild(dialog) },
  () => document.body.removeChild(dialog));
  console.log((dialog))
  document.body.appendChild(dialog);
  dialog.style.display = "flex";
}

function closeModal() {
  document.getElementById("inputText").value = "";
  document.getElementById("modalContainer").style.display = "none";
}

function submitText(inputText) {
  // const inputText = document.getElementById("inputText").value;
  // alert("You entered: " + inputText);

  context.font = font

  const splitStringByLines = inputText.split("\n");

  let metrics = context.measureText(inputText);
  let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  const textWidth = metrics.width;

  // console.log(metrics)
  // console.log(actualHeight)
  // console.log(textWidth)

  let newWidth = 0;

  for(let text of splitStringByLines) {
    const w = context.measureText(text).width;
    if(w > newWidth)
          newWidth = w;
  }

  const text = new TextContainer(canvas.width/2 - newWidth/2, canvas.height/2, newWidth ,(textSize) * splitStringByLines.length + (10 * (splitStringByLines.length - 1)), undefined ,containerList.size, inputText);
  // text.cursorPositionX = textPrompt.length;4 
  containerList.push(text);
  
  drawContainers();
  closeModal();
}




