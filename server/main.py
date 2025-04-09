from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import socketio
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import json
import requests
import os
import base64

app = FastAPI()

# Socket.IO Configuration
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="http://localhost:3000")
socket_app = socketio.ASGIApp(sio, app, socketio_path="/socket.io/")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Loading
MODEL_URL = "https://drive.google.com/uc?export=download&id=1xjPPTQwu1_t5Ba1l8iDrr_QJL6dQFm5-"
MODEL_PATH = "engagement_model_final.h5"

# Download Model
def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Downloading model...")
        try:
            response = requests.get(MODEL_URL)
            response.raise_for_status()
            with open(MODEL_PATH, "wb") as f:
                f.write(response.content)
            print("Model downloaded successfully.")
        except Exception as e:
            raise RuntimeError(f"Failed to download model: {e}")

download_model()

if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Model file not found after download attempt.")

try:
    model = keras.models.load_model(MODEL_PATH, compile=False)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Placeholder for class labels
classes = ["Enggaged High", "Enggaged Low", "Enggaged But not listening"] 

# Image Preprocessing Function
def preprocess_image(image_data):
    try:
        print("Preprocessing image...")
        if "," in image_data:
            image_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((128, 128))
        image = np.array(image)
        image = tf.keras.applications.efficientnet.preprocess_input(image)
        image = np.expand_dims(image, axis=0)
        print("Image preprocessed successfully")
        return image
    except Exception as e:
        print(f"Error during image preprocessing: {e}")
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {e}")

# Socket.IO Events
@sio.on("connect")
async def connect(sid, environ):
    print(f"Client {sid} connected")
    print("Environ:", environ)

@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@sio.on("start_prediction")
async def start_prediction(sid, data):
    try:
        print(f"Received data from client {sid}: {data}")
        image_data = data.get("image_data")
        roomId = data.get("roomId")
        password = data.get("password")
        name = data.get("name")
        print(roomId)
        if not image_data:
            await sio.emit("error", {"error": "Image data missing"}, room=sid)
            return

        image = preprocess_image(image_data)
        prediction = model.predict(image)

        class_index = np.argmax(prediction[0])

        await sio.emit("prediction", {
            "class": classes[class_index],
            "name":name,
            "id":sid,
            "roomId":roomId,
            "password":password,
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        await sio.emit("error", {"error": str(e)}, room=sid)

@app.get("/health")
async def health():
    return {"status": "ok"}

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000)) 
    uvicorn.run("main:socket_app", host="0.0.0.0", port=port)
