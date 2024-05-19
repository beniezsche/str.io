import TextContainer from "./textContainer.js";

export default function createTextContainerFromInput(inputText, context) {

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
    return text;

}


