"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiCameraOff } from "react-icons/fi";
import Result from "./result";
import Username from "./username";
import { initializeSocket } from "@/lib/socket";
import { captureImage, startCamera, stopCamera } from "@/lib/camera-utils";
import { CameraType, ResultType } from "./type";
import * as faceapi from "face-api.js"; 

const Camera = ({ password, roomId }: CameraType) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [name, setName] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const socketRef = useRef<ReturnType<typeof initializeSocket> | null>(null);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        setModelsLoaded(true);
        console.log("SSD Mobilenetv1 model loaded.");
      } catch (error) {
        console.error("Failed to load SSD Mobilenetv1 model:", error);
      }
    };
    loadModels();
  }, []);

  // Initialize WebSocket
  useEffect(() => {
    socketRef.current = initializeSocket(
      () => toast.success("WebSocket connected successfully."),
      () => {},
      () => toast.error("WebSocket connection error."),
      () => toast("WebSocket disconnected.")
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }
    if (isCameraOn) {
      stopCamera(videoRef as React.RefObject<HTMLVideoElement>);
      setIsCameraOn(false);
      setIsPredicting(false);
    } else {
      const success = await startCamera(
        videoRef as React.RefObject<HTMLVideoElement>
      );
      setIsCameraOn(success);
      setIsPredicting(true);
    }
  };

  // Handle prediction with face cropping
  const handlePredict = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const capturedImage = captureImage(
      canvasRef as React.RefObject<HTMLCanvasElement>,
      videoRef as React.RefObject<HTMLVideoElement>
    );
    if (!capturedImage) {
      toast.error("Please start the camera first.");
      setIsProcessing(false);
      return;
    }

    const image = new Image();
    image.src = capturedImage;
    image.onload = async () => {
      // Detect faces and get bounding box
      const detections = await faceapi.detectAllFaces(
        image,
        new faceapi.SsdMobilenetv1Options()
      );

      if (detections.length > 0) {
        // Get the first detected face's bounding box
        const face = detections[0].box;

        // Create a canvas to crop the face
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the face's dimensions
        canvas.width = face.width;
        canvas.height = face.height;

        // Draw only the face region onto the canvas
        ctx?.drawImage(
          image,
          face.x,
          face.y,
          face.width,
          face.height,
          0,
          0,
          face.width,
          face.height
        );

        // Convert cropped face to data URL
        const croppedFace = canvas.toDataURL("image/jpeg");

        // Send cropped face to the server
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("start_prediction", {
            image_data: croppedFace, // Sending only the cropped face
            name,
            roomId,
            password,
          });
        } else {
          toast.error("WebSocket connection is closed.");
        }
      } else {
        toast("No face detected in the frame.");
      }

      setIsProcessing(false);
    };
  };

  // Start/stop prediction loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPredicting) {
      if (name.length < 3) {
        toast.error("Name should be at least 3 characters long.");
        setIsPredicting(false);
        return;
      }

      handlePredict();
      interval = setInterval(() => handlePredict(), 3000);
    }
    return () => clearInterval(interval);
  }, [isPredicting]);

  const buttonClass =
    "bg-foreground text-white px-4 py-2 rounded hover:opacity-70 active:translate-y-1 duration-200";

  return (
    <>
      <div className="relative rounded-lg w-full max-w-[800px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="border border-green-500 aspect-video object-cover h-full w-full"
        />
        {!isCameraOn && (
          <div className="absolute left-0 top-0 border border-red-500 aspect-video opacity-45 text-xl object-fill rounded-lg w-full h-full flex justify-center items-center flex-col">
            <FiCameraOff size={30} />
            <p>Camera Is Off</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-4 flex-col sm:flex-row w-full max-w-[800px]">
        <Username name={name} setName={setName} />
        <button
          onClick={toggleCamera}
          className={`${buttonClass} ${isCameraOn && "bg-red-500 !text-white"}`}
        >
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
    </>
  );
};

export default Camera;