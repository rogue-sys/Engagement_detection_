🧠 Real-Time Student Engagement Detection using EfficientNet

This project detects student engagement levels in real-time using deep learning and webcam image input. It classifies engagement into three categories:

Engaged High

Engaged Low

Engaged but not Listening

Built with TensorFlow (EfficientNetB0), FastAPI, Socket.IO, and React (Frontend). The model is trained on custom labeled facial images and uses real-time image data for prediction.

🔍 Features:
Real-time engagement classification using webcam snapshots

EfficientNet-based model trained on preprocessed and augmented image data

Socket.IO for live communication between backend and frontend

FastAPI backend for image processing and prediction

Clean CORS-enabled API design
