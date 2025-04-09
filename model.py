import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.regularizers import l2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

# Set constants
IMG_SIZE = (128, 128)  # Reduced image size
BATCH_SIZE = 8  # Reduced batch size
EPOCHS = 5  # Reduced epochs

# Load preprocessed CSV files
train_df = pd.read_csv('train_balanced_undersampled.csv')
val_df = pd.read_csv('val_balanced_undersampled.csv')

# One-hot encode labels
train_df['Class'] = train_df['Class'].astype(str)
val_df['Class'] = val_df['Class'].astype(str)

# Image Data Generator with data augmentation
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=20,       # Randomly rotate images
    width_shift_range=0.2,   # Randomly shift images horizontally
    height_shift_range=0.2,  # Randomly shift images vertically
    shear_range=0.2,         # Shear transformations
    zoom_range=0.2,          # Randomly zoom images
    horizontal_flip=True,    # Randomly flip images horizontally
    fill_mode='nearest'      # Fill missing pixels after transformations
)

val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

# Data generator function
train_generator = train_datagen.flow_from_dataframe(
    train_df,
    x_col='image_path',
    y_col='Class',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_generator = val_datagen.flow_from_dataframe(
    val_df,
    x_col='image_path',
    y_col='Class',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Load EfficientNetB0
base_model = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(128, 128, 3))

# Freeze the base model layers
base_model.trainable = False

# Add custom layers with Dropout and L2 Regularization
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation='relu', kernel_regularizer=l2(0.01))(x)  # L2 Regularization
x = Dropout(0.5)(x)  # Dropout with 50% rate
num_classes = len(train_generator.class_indices)  # Number of classes
predictions = Dense(num_classes, activation='softmax')(x)

# Create model
model = Model(inputs=base_model.input, outputs=predictions)

# Compile model
model.compile(optimizer=Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# Early stopping
early_stopping = EarlyStopping(
    monitor='val_loss',  # Monitor validation loss
    patience=3,          # Stop after 3 epochs without improvement
    restore_best_weights=True  # Restore the best model weights
)

print(train_generator.class_indices)


# Train model
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=[early_stopping]  # Add early stopping
)

# Save trained model
model.save('engagement_model_final.h5')

print("Model training complete. Model saved as 'engagement_model_final.h5'.")