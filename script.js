"use strict";

const resizeHandle = document.getElementById("resize-handle");
const image = document.getElementById("image");
const add = document.getElementById("add");
const canvas = document.getElementById("canvas");
let prevX = 0;
let prevY = 0;


const documentHeight = document.documentElement.clientHeight;
const documentWidth = document.documentElement.clientWidth;

const canvasWidth = (9/16) * documentHeight;

canvas.style.width = canvasWidth + 'px';
canvas.style.height = documentHeight + 'px';


add.addEventListener("onclick", (e) => {
    //open image selector
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
  const imageWidth = image.offsetWidth - diffX;
  const imageHeight = (imageWidth / image.naturalWidth) * image.naturalHeight;
  image.style.width = imageWidth + "px";
  image.style.height = imageHeight + "px";
  prevX = e.clientX;
  prevY = e.clientY;
}

function stopResize() {
  document.removeEventListener("mousemove", resizeImage);
}