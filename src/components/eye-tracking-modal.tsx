
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
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
    runningMode: 'VIDEO',
    numFaces: 1,
  });
}

export const EyeTrackingModal = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const initialize = async () => {
        if (!faceLandmarker) {
          await createFaceLandmarker();
        }
        setIsModelLoaded(true);
    };
    initialize();
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
    
    const drawingUtils = new DrawingUtils(canvasCtx);
    
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = faceLandmarker.detectForVideo(video, nowInMs);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          // Draw just the eyes
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#30FF30" }
          );
        }
      }
    }
    
    animationFrameId = requestAnimationFrame(predictWebcam);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>CV: Детекция глаз</DialogTitle>
          <DialogDescription>
            Система использует MediaPipe для отслеживания ключевых точек на лице в реальном времени.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Alert variant="destructive" className="w-auto">
                      <AlertTitle>Доступ к камере необходим</AlertTitle>
                      <AlertDescription>
                        Пожалуйста, разрешите доступ к камере, чтобы использовать эту функцию.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
            {hasCameraPermission === true && !isModelLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <p className="text-foreground animate-pulse">Загрузка модели CV...</p>
                 </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
