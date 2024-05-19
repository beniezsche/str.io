import  Container from '../containers/container.js'

export default class TextContainer extends Container {
    constructor(x, y, width, height, src, zIndex, text) {
      super(x, y, width, height, src, zIndex);
      this.text = text;
      this.isEditable = false;
      this.cursorPositionX = 0;
      this.cursorPositionY = 0;
    }
}