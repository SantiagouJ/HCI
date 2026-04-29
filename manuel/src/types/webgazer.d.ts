interface WebGazerPrediction {
  x: number;
  y: number;
  eyeFeatures?: unknown;
}

interface WebGazerInstance {
  setGazeListener(
    callback: (data: WebGazerPrediction | null, elapsedTime: number) => void
  ): WebGazerInstance;
  clearGazeListener(): WebGazerInstance;
  begin(): Promise<WebGazerInstance>;
  end(): WebGazerInstance;
  pause(): WebGazerInstance;
  resume(): WebGazerInstance;
  showPredictionPoints(show: boolean): WebGazerInstance;
  showVideo(show: boolean): WebGazerInstance;
  showFaceOverlay(show: boolean): WebGazerInstance;
  showFaceFeedbackBox(show: boolean): WebGazerInstance;
  setRegression(name: string): WebGazerInstance;
  addMouseEventListeners(): WebGazerInstance;
  removeMouseEventListeners(): WebGazerInstance;
  isReady(): boolean;
}

declare module 'webgazer' {
  const webgazer: WebGazerInstance;
  export default webgazer;
}

interface Window {
  webgazer: WebGazerInstance | undefined;
}
