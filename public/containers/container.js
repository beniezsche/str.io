import Border from "./border.js";
import Handle from "./handle.js";

const margin = 10;


export default class Container {

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