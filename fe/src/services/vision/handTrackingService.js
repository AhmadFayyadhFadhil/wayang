import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

class HandTrackingService {
  constructor() {
    this.handLandmarker = null;
    this.isInitializing = false;
    this.isRunning = false;
    this.videoElement = null;
    this.animationFrameId = null;
    this.onResultsCallback = null;
    this.status = 'idle'; // 'idle' | 'loading' | 'ready' | 'running' | 'error'
    this.lastError = null;
  }

  /**
   * Inisialisasi model HandLandmarker MediaPipe
   */
  async init() {
    if (this.handLandmarker) return this.handLandmarker;
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 80));
      }
      return this.handLandmarker;
    }

    this.isInitializing = true;
    this.status = 'loading';
    this.lastError = null;

    try {
      // Muat WebAssembly Vision Tasks dari CDN jsdelivr
      const wasmFileset = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.status = 'ready';
      return this.handLandmarker;
    } catch (err) {
      this.status = 'error';
      this.lastError = err?.message || 'Gagal menginisialisasi model pengenal tangan';
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Mulai menangkap aliran webcam dan menjalankan deteksi
   */
  async start(videoElement, onResultsCallback) {
    if (!videoElement) throw new Error('Video element diperlukan');
    this.videoElement = videoElement;
    this.onResultsCallback = onResultsCallback;

    if (!this.handLandmarker) {
      await this.init();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320, max: 480 },
          height: { ideal: 240, max: 360 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      this.videoElement.srcObject = stream;
      await new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play();
          resolve();
        };
      });

      this.isRunning = true;
      this.status = 'running';
      this.lastVideoTime = -1;
      this.predictLoop();
      return true;
    } catch (err) {
      this.status = 'error';
      this.lastError = err?.message || 'Gagal mengakses webcam';
      throw err;
    }
  }

  /**
   * Loop deteksi per frame render efisien (hanya saat frame video baru tiba)
   */
  predictLoop() {
    if (!this.isRunning || !this.videoElement || !this.handLandmarker) return;

    if (this.videoElement.readyState >= 2 && this.videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      try {
        const startTimeMs = performance.now();
        const results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);
        if (this.onResultsCallback) {
          this.onResultsCallback(results);
        }
      } catch {
        // Safe skip frame
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.predictLoop());
  }

  /**
   * Hentikan webcam dan proses deteksi
   */
  stop() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject;
      const tracks = stream.getTracks ? stream.getTracks() : [];
      tracks.forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }

    this.status = this.handLandmarker ? 'ready' : 'idle';
  }
}

export const handTrackingService = new HandTrackingService();
export default handTrackingService;
