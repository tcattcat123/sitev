
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast"

let faceLandmarker: FaceLandmarker | undefined;
let lastVideoTime = -1;
let animationFrameId: number;

async function createFaceLandmarker() {
  if (typeof window === 'undefined') return;
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,
    runningMode: 'VIDEO',
    numFaces: 1,
  });
}

const Emotions = {
    'mouthSmileLeft': 'HAPPY',
    'mouthSmileRight': 'HAPPY',
    'eyeSquintLeft': 'HAPPY',
    'eyeSquintRight': 'HAPPY',
    'mouthFrownLeft': 'SAD',
    'mouthFrownRight': 'SAD',
    'browDownLeft': 'ANGRY',
    'browDownRight': 'ANGRY',
};
type Emotion = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';


export const EyeTrackingModal = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyesDetected, setEyesDetected] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion>('NEUTRAL');

  useEffect(() => {
    const initialize = async () => {
        if (!faceLandmarker) {
          await createFaceLandmarker();
        }
        setIsModelLoaded(true);
    };
    if (typeof window !== 'undefined') {
        initialize();
    }
  }, []);

  useEffect(() => {
    if (!isModelLoaded || typeof navigator === 'undefined') return;
    
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: 'Ошибка камеры',
            description: 'Ваш браузер не поддерживает доступ к камере.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Доступ к камере запрещен',
          description: 'Пожалуйста, разрешите доступ к камере в настройках браузера.',
        });
      }
    };

    getCameraPermission();

    return () => {
        cancelAnimationFrame(animationFrameId);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, isModelLoaded]);

  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarker) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    if (!canvasCtx) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (canvas.width !== videoWidth) canvas.width = videoWidth;
    if (canvas.height !== videoHeight) canvas.height = videoHeight;
    
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = faceLandmarker.detectForVideo(video, nowInMs);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        setFaceDetected(true);
        const landmarks = results.faceLandmarks[0];

        // Draw face bounding box
        const x = Math.min(...landmarks.map(p => p.x)) * videoWidth;
        const y = Math.min(...landmarks.map(p => p.y)) * videoHeight;
        const width = (Math.max(...landmarks.map(p => p.x)) - Math.min(...landmarks.map(p => p.x))) * videoWidth;
        const height = (Math.max(...landmarks.map(p => p.y)) - Math.min(...landmarks.map(p => p.y))) * videoHeight;
        canvasCtx.strokeStyle = 'lime';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(x, y, width, height);

        // Draw eye bounding boxes
        const leftEyeLandmarks = FaceLandmarker.FACE_LANDMARKS_LEFT_EYE;
        const rightEyeLandmarks = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE;
        
        const drawEyeBox = (eyeIndices: { start: number, end: number }[]) => {
            const eyePoints = eyeIndices.flatMap(range => landmarks.slice(range.start, range.end + 1));
            if (eyePoints.length > 0) {
                const ex = Math.min(...eyePoints.map(p => p.x)) * videoWidth;
                const ey = Math.min(...eyePoints.map(p => p.y)) * videoHeight;
                const ew = (Math.max(...eyePoints.map(p => p.x)) - Math.min(...eyePoints.map(p => p.x))) * videoWidth;
                const eh = (Math.max(...eyePoints.map(p => p.y)) - Math.min(...eyePoints.map(p => p.y))) * videoHeight;
                canvasCtx.strokeStyle = 'red';
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeRect(ex, ey, ew, eh);
                return true;
            }
            return false;
        }

        const leftEyeDetected = drawEyeBox(leftEyeLandmarks);
        const rightEyeDetected = drawEyeBox(rightEyeLandmarks);
        setEyesDetected(leftEyeDetected && rightEyeDetected);
        
        // Emotion detection
        let currentEmotion: Emotion = 'NEUTRAL';
        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            const blendshapes = results.faceBlendshapes[0].categories;
            const prominentEmotion = blendshapes
                .filter(shape => Object.keys(Emotions).includes(shape.categoryName) && shape.score > 0.5)
                .sort((a, b) => b.score - a.score)[0];
            if (prominentEmotion) {
                currentEmotion = Emotions[prominentEmotion.categoryName as keyof typeof Emotions] as Emotion;
            }
        }
        setDetectedEmotion(currentEmotion);

      } else {
        setFaceDetected(false);
        setEyesDetected(false);
        setDetectedEmotion('NEUTRAL');
      }
    }
    
    animationFrameId = requestAnimationFrame(predictWebcam);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card/80 backdrop-blur-sm border-primary text-red-500 font-mono">
        <DialogHeader>
          <DialogTitle className="text-red-500">VIPE CONSOLE</DialogTitle>
          <DialogDescription className="text-red-500/80">
            TECHNOLOGY: MediaPipe FaceLandmarker. Real-time facial landmark detection.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md border-2 border-red-500/50 bg-black">
            <video ref={videoRef} className="w-full aspect-video opacity-70" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            
            {<div className="glitch-overlay opacity-50" style={{'--glitch-color-1': 'rgba(255,0,0,0.1)', '--glitch-color-2': 'rgba(0,0,155,0.1)'} as React.CSSProperties}/>}
            
            <div className="absolute top-2 left-2 text-sm uppercase">
                <p>VISUAL: {faceDetected ? 'ONLINE' : 'OFFLINE'}</p>
                <p>GENDER: UNKNOWN</p>
                <p>OBJ: {detectedEmotion}</p>
            </div>
            
            <div className="absolute bottom-2 left-2 text-sm uppercase">
                {faceDetected ? '// FACE DETECTED //' : '// SCANNING... //'}
            </div>

            {eyesDetected && (
                <div className="absolute bottom-8 left-2 text-sm text-lime-400 uppercase animate-pulse">
                    {'// EYES LOCKED //'}
                </div>
            )}


            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Alert variant="destructive" className="w-auto border-red-500 text-red-500">
                      <AlertTitle>CAMERA ACCESS DENIED</AlertTitle>
                      <AlertDescription>
                        PLEASE ENABLE CAMERA PERMISSION TO USE THIS FEATURE.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
            {hasCameraPermission === true && !isModelLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <p className="text-red-500 animate-pulse">LOADING MODEL...</p>
                 </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

    