export const startCamera = async (
    videoRef: React.RefObject<HTMLVideoElement>
  ): Promise<boolean> => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
        return true;
      }
    } catch {
      console.error("Error accessing camera");
    }
    return false;
  };
  
  export const stopCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current!.srcObject = null;
    }
  };
  
  export const captureImage = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    videoRef: React.RefObject<HTMLVideoElement>
  ): string | null => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return null;
  
    const context = canvas.getContext("2d");
    if (!context) return null;
  
    canvas.width = video.videoWidth / 2;
    canvas.height = video.videoHeight / 2;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    return canvas.toDataURL("image/jpeg", 0.7);
  };
  