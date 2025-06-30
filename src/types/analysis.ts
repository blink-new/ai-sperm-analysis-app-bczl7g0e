export interface MovementPattern {
  progressif: number;
  'non-progressif': number;
  immobile: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  filename: string;
  spermCount: number;
  speedAvg: number; // µm/s
  movementPattern: MovementPattern;
  concentration?: number; // million/ml
  motility?: number; // percentage
  totalMotileCount?: number; // million
  morphology?: {
    normal: number;
    abnormal: number;
  };
  videoUrl?: string;
  processingTime?: number; // seconds
}

export interface AnalysisProgress {
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete';
  progress: number;
  message: string;
}