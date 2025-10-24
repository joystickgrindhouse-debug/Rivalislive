import { Pose } from "https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/pose.js";
import { Camera } from "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

let pose = null;
let camera = null;

export function startPoseCapture(videoEl, onResults){
  if (!pose){
    pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults((results) => {
      onResults && onResults(results);
    });
  }

  camera = new Camera(videoEl, {
    onFrame: async () => { await pose.send({image: videoEl}); },
    width: 640,
    height: 480
  });
  camera.start().catch(e=>console.error('Camera start failed', e));
  return pose;
}

export function stopPoseCapture(){
  if (camera){ camera.stop(); camera = null; }
  if (pose){ pose.close(); pose = null; }
}
