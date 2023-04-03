"use strict";

const resizeHandle = document.getElementById("resize-handle");
// const image = document.getElementById("image");
const componentHolder = document.getElementById("component-holder");
const add = document.getElementById("add");
const canvas = document.getElementById("canvas");
let prevX = 0;
let prevY = 0;


const documentHeight = document.documentElement.clientHeight;
const documentWidth = document.documentElement.clientWidth;

const canvasWidth = (9/16) * documentHeight;

canvas.width = canvasWidth;
canvas.height = documentHeight;

window.addEventListener("load", (event) => {
  draw();
});

function draw() {
  // const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);
  }
}


// add.addEventListener("onclick", (e) => {
//     //open image selector
// });

componentHolder.addEventListener("mousemove", (e) => {

});


resizeHandle.addEventListener("mousedown", (e) => {
  prevX = e.clientX;
  prevY = e.clientY;

  document.addEventListener("mousemove", resizeImage);
  document.addEventListener("mouseup", stopResize);

});

function resizeImage(e) {
  const diffX = e.clientX - prevX;
  const diffY = e.clientY - prevY;
  const imageWidth = componentHolder.offsetWidth + diffX;
  const imageHeight = componentHolder.offsetHeight + diffY;
  componentHolder.style.width = imageWidth + "px";
  componentHolder.style.height = imageHeight + "px";
  // prevX = e.clientX;
  // prevY = e.clientY;

  // componentHolder.style.height = 
}

function stopResize() {
  document.removeEventListener("mousemove", resizeImage);
}