# 🧠 Real-Time Student Engagement Detection System

A deep learning-based system that predicts student engagement levels in real-time during online classes using facial features extracted from webcam frames.

The system classifies student engagement into three categories:

- Engaged High
- Engaged Low
- Engaged but Not Listening

Built using **TensorFlow (EfficientNetB0), FastAPI, Socket.IO, and React (Next.js)**.

---

## 🚀 Project Overview

This project aims to help teachers monitor student engagement in online learning environments by analyzing facial cues from live video feeds.

The system works in real-time:
1. Captures webcam frames from students.
2. Detects and crops faces.
3. Sends processed images to the backend.
4. Predicts engagement level using a deep learning model.
5. Displays results on the teacher dashboard.

---

## 🧠 Model Development

### Transfer Learning Approach

We used **EfficientNetB0 (pretrained on ImageNet)** as a feature extractor and built a custom classification head for engagement prediction.

- `include_top=False` was used to remove ImageNet's 1000-class classifier.
- The backbone was initially frozen to preserve pretrained knowledge.
- Custom layers were added for engagement classification.

---

### 📐 Model Architecture

Input Shape: `(128, 128, 3)`

Architecture:

1. **EfficientNetB0 (Feature Extractor)**
   - Extracts high-level facial features.
   - Pretrained on ImageNet.

2. **GlobalAveragePooling2D**
   - Converts feature maps into a single feature vector.
   - Reduces parameters and prevents overfitting.

3. **Dense Layer (512 units, ReLU activation)**
   - Learns task-specific engagement patterns.
   - ReLU introduces non-linearity.

4. **L2 Regularization (λ = 0.01)**
   - Penalizes large weights.
   - Improves generalization on small datasets.

5. **Dropout (0.5)**
   - Prevents overfitting by randomly disabling neurons during training.

6. **Output Layer (Softmax – 3 units)**
   - Produces class probabilities.
   - Classes:
     - Engaged High
     - Engaged Low
     - Engaged but Not Listening

---

## 📊 Dataset Processing Pipeline

### 1️⃣ Video to Frame Conversion
- Extracted multiple frames from each video.
- Increased data diversity.

### 2️⃣ Face Extraction
- Used OpenCV Haar Cascade to detect and crop faces.
- Removed background noise.

### 3️⃣ Label Mapping
Original DAiSEE attributes:
- Engagement
- Boredom
- Confusion
- Frustration

Mapped into final 3 engagement classes using rule-based logic.

### 4️⃣ Dataset Balancing
- Dataset was imbalanced.
- Applied undersampling.
- Final training dataset:
  - 655 images per class.

### 5️⃣ Data Augmentation
Applied during training:
- Rotation
- Zoom
- Horizontal flip
- Width/height shifts

---

## ⚙️ Training Configuration

- Input Size: 128 × 128
- Loss Function: Categorical Crossentropy
- Optimizer: Adam
- Batch Size: 8
- Early Stopping: Enabled
- Data Augmentation: Yes

---

## 🔄 Real-Time Prediction Flow

### Frontend (React + Face-api.js)
1. Capture webcam frame.
2. Detect and crop face.
3. Convert to Base64.
4. Send to backend via Socket.IO.

### Backend (FastAPI + TensorFlow)
1. Decode Base64 image.
2. Resize to (128,128).
3. Apply EfficientNet preprocessing.
4. Convert to tensor `(1,128,128,3)`.
5. Run `model.predict()`.
6. Return predicted class to frontend.

### Teacher Dashboard
- Displays real-time engagement status per student.

---

## 🛠 Tech Stack

### Frontend
- Next.js (React)
- Tailwind CSS
- Face-api.js
- Socket.IO Client
- Framer Motion
- React Hot Toast

### Backend
- FastAPI
- Python-SocketIO
- TensorFlow + Keras
- Pillow (PIL)
- NumPy
- Uvicorn

---

## 📌 Why EfficientNet?

- High accuracy with fewer parameters.
- Efficient compound scaling (depth, width, resolution).
- Strong pretrained ImageNet backbone.
- Suitable for real-time inference.

---

## 📈 Results

- Balanced dataset with 3 engagement classes.
- Achieved strong classification performance using transfer learning.
- Successfully deployed in real-time with low latency.

---

## 🎯 Key Highlights

- Real-time ML deployment.
- Transfer learning implementation.
- Balanced dataset handling.
- End-to-end full-stack integration.
- WebSocket-based live prediction system.

---

## 🧑‍💻 Author

Developed as part of an AI-based student engagement monitoring system project.

---
