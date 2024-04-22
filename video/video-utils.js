export default function checkIfWebCodecsSupported() {
 // Check if the browser supports the WebCodecs API
  if ('VideoDecoder' in window) {

    console.log("videodecoder exists");
    // Create a new VideoDecoder instance

    try {
      const videoDecoder = new VideoDecoder({
        output: (frame) => {
            // This callback function is called whenever a video frame is decoded
            // 'frame' is a VideoFrame object representing the decoded frame
            // You can render the frame onto a canvas, display it in a video element, etc.
            console.log(frame)
            context.drawImage(frame, 0, 0, canvas.width, canvas.height);
            
        }
    });
      videoDecoder.decode(buffer);
    }
    catch (e) {
      console.log(e)
    }


    // Fetch and decode a video file
    // fetch('example-video.mp4')
    //     .then(response => response.arrayBuffer())
    //     .then(arrayBuffer => {
    //         // Decode the video data
    //         videoDecoder.decode(arrayBuffer);
    //     })
    //     .catch(error => {
    //         console.error('Error fetching or decoding video:', error);
    //     });
  } else {
    console.error('WebCodecs API is not supported in this browser.');
  }

}