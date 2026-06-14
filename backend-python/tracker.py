import cv2
import mediapipe as mp
import asyncio
import websockets
import json

# ==========================================
# 1. MediaPipe Tasks API Configuration
# ==========================================
model_path = 'hand_landmarker.task'
BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.7,
    min_hand_presence_confidence=0.7,
    min_tracking_confidence=0.7
)

# Global state to prevent spamming the WebSocket
current_state = "UNKNOWN"

# ==========================================
# 2. Gesture Detection Math
# ==========================================
def detect_gesture(hand_landmarks):
    """
    Analyzes landmark coordinates to determine exact hand state.
    """
    tip_ids = [8, 12, 16, 20]
    pip_ids = [6, 10, 14, 18]
    
    fingers_open = []
    for tip, pip in zip(tip_ids, pip_ids):
        # Y-axis is inverted (0 is top). If tip is above knuckle, it is open.
        if hand_landmarks[tip].y < hand_landmarks[pip].y:
            fingers_open.append(True)
        else:
            fingers_open.append(False)
            
    # All fingers extended
    if all(fingers_open):
        return "OPEN_PALM"
        
    # All fingers closed
    if not any(fingers_open):
        return "CLOSED_FIST"
        
    return "UNKNOWN"

# ==========================================
# 3. The Vision & Network Pipeline
# ==========================================
async def vision_pipeline(websocket):
    global current_state
    cap = cv2.VideoCapture(0)
    print("🎥 Vision Pipeline Active. Press 'q' inside the video window to stop.")

    with HandLandmarker.create_from_options(options) as landmarker:
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                await asyncio.sleep(0.01)
                continue

            frame = cv2.flip(frame, 1)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            detection_result = landmarker.detect(mp_image)
            detected = "UNKNOWN"
            
            if detection_result.hand_landmarks:
                hand_landmarks = detection_result.hand_landmarks[0]
                
                # Draw tracking UI
                h, w, _ = frame.shape
                for landmark in hand_landmarks:
                    cx, cy = int(landmark.x * w), int(landmark.y * h)
                    cv2.circle(frame, (cx, cy), 6, (0, 255, 0), cv2.FILLED)
                    
                detected = detect_gesture(hand_landmarks)

            # State Machine: Only fire WebSocket message when gesture changes
            if detected != current_state:
                current_state = detected
                payload = None 
                
                if current_state == "OPEN_PALM":
                    payload = json.dumps({"action": "PLAY"})
                    print(f"▶️ Gesture Detected! Sending: PLAY")
                
                elif current_state == "CLOSED_FIST":
                    payload = json.dumps({"action": "PAUSE"})
                    print(f"⏸️ Gesture Detected! Sending: PAUSE")

                if payload:
                    try:
                        await websocket.send(payload)
                    except Exception:
                        print("❌ Connection to backend lost.")
                        break

            cv2.imshow('Gesture Engine - Active Tracking', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
            await asyncio.sleep(0.01)

    cap.release()
    cv2.destroyAllWindows()

# ==========================================
# 4. WebSocket Connection Manager
# ==========================================
async def connect_to_backend():
    uri = "ws://localhost:8086/gestures"
    print(f"🔗 Attempting connection to Spring Boot at: {uri}")
    
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("✅ Successfully bonded with Spring Boot!")
                await vision_pipeline(websocket)
        except Exception:
            print("⏳ Spring Boot not reachable. Retrying in 3 seconds...")
            await asyncio.sleep(3)

if __name__ == "__main__":
    asyncio.run(connect_to_backend())