
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
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
type HairColor = 'LIGHT' | 'DARK' | 'UNKNOWN';

export const EyeTrackingModal = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyesDetected, setEyesDetected] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion>('NEUTRAL');
  const [hairColor, setHairColor] = useState<HairColor>('UNKNOWN');

  useEffect(() => {
    let isCancelled = false;

    async function setupVision() {
      // Load models
      await createFaceLandmarker();
      if (isCancelled) return;
      setIsModelLoaded(true);
      
      // Get camera permission
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({ variant: 'destructive', title: 'Ошибка камеры', description: 'Ваш браузер не поддерживает доступ к камере.' });
        setHasCameraPermission(false);
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (isCancelled) {
            stream.getTracks().forEach(track => track.stop());
            return;
        };

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
    }

    setupVision();

    return () => {
        isCancelled = true;
        cancelAnimationFrame(animationFrameId);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const getAverageColor = (ctx: CanvasRenderingContext2D, points: {x: number, y: number}[]) => {
    let r = 0, g = 0, b = 0;
    let count = 0;
    points.forEach(point => {
        const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
        if (pixelData[3] > 0) { // Check alpha
            r += pixelData[0];
            g += pixelData[1];
            b += pixelData[2];
            count++;
        }
    });
    if (count === 0) return null;
    return (r / count + g / count + b / count) / 3;
  };


  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarker) {
      animationFrameId = requestAnimationFrame(predictWebcam);
      return;
    }
    
    const video = videoRef.current;
    if (video.readyState < 2) {
      animationFrameId = requestAnimationFrame(predictWebcam);
      return;
    }

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d", { willReadFrequently: true });


    if (!canvasCtx) {
      animationFrameId = requestAnimationFrame(predictWebcam);
      return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (canvas.width !== videoWidth) canvas.width = videoWidth;
    if (canvas.height !== videoHeight) canvas.height = videoHeight;
    
    // Draw video frame to canvas to read pixel data
    canvasCtx.drawImage(video, 0, 0, videoWidth, videoHeight);

    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const faceResults = faceLandmarker.detectForVideo(video, nowInMs);

      // We don't clear because video is drawn on each frame
      
      if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
        setFaceDetected(true);
        const landmarks = faceResults.faceLandmarks[0];

        // Draw face bounding box
        const x = Math.min(...landmarks.map(p => p.x)) * videoWidth;
        const y = Math.min(...landmarks.map(p => p.y)) * videoHeight;
        const width = (Math.max(...landmarks.map(p => p.x)) - Math.min(...landmarks.map(p => p.x))) * videoWidth;
        const height = (Math.max(...landmarks.map(p => p.y)) - Math.min(...landmarks.map(p => p.y))) * videoHeight;
        canvasCtx.strokeStyle = 'lime';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(x, y, width, height);

        // Hair color detection
        const hairRegionIndices = [10, 109, 67, 103]; 
        const hairPoints = hairRegionIndices.map(i => ({
            x: landmarks[i].x * videoWidth,
            y: (landmarks[i].y * videoHeight) - (0.05 * videoHeight) // Shift up slightly
        }));
        
        const avgBrightness = getAverageColor(canvasCtx, hairPoints);
        if (avgBrightness !== null) {
            setHairColor(avgBrightness > 128 ? 'LIGHT' : 'DARK');
        } else {
            setHairColor('UNKNOWN');
        }

        // Indices for left and right eye centers (pupils)
        const leftEyeCenterIndex = 473; 
        const rightEyeCenterIndex = 468;
        
        const drawEyeBox = (centerIndex: number) => {
            const centerPoint = landmarks[centerIndex];
            if (centerPoint) {
                const ex = (centerPoint.x * videoWidth) - 25;
                const ey = (centerPoint.y * videoHeight) - 25;
                canvasCtx.strokeStyle = 'red';
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeRect(ex, ey, 50, 50);
                return true;
            }
            return false;
        }

        const leftEyeDetected = drawEyeBox(leftEyeCenterIndex);
        const rightEyeDetected = drawEyeBox(rightEyeCenterIndex);
        setEyesDetected(leftEyeDetected && rightEyeDetected);
        
        let currentEmotion: Emotion = 'NEUTRAL';
        if (faceResults.faceBlendshapes && faceResults.faceBlendshapes.length > 0 && faceResults.faceBlendshapes[0].categories) {
            const blendshapes = faceResults.faceBlendshapes[0].categories;
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
        setHairColor('UNKNOWN');
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
            <video ref={videoRef} className="w-full h-full object-cover opacity-0" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover" />
            
            <div className="glitch-overlay opacity-50" style={{'--glitch-color-1': 'rgba(255,0,0,0.1)', '--glitch-color-2': 'rgba(0,0,155,0.1)'} as React.CSSProperties}/>
            
            <div className="absolute top-2 left-2 text-sm uppercase">
                <p>VISUAL: {faceDetected ? 'ONLINE' : 'OFFLINE'}</p>
                <p>HAIR: {hairColor}</p>
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
                    <p className="text-red-500 animate-pulse">LOADING MODELS...</p>
                 </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
