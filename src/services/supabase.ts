import { createClient } from '@supabase/supabase-js';
import { AnalysisResult } from '../types/analysis';

// Get environment variables with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client for development if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using mock mode.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Upload video function with mock fallback
export const uploadVideo = async (file: File): Promise<{ publicUrl: string; filePath: string }> => {
  if (!supabase) {
    // Mock response for development
    console.log('Mock mode: Simulating video upload');
    return {
      publicUrl: URL.createObjectURL(file),
      filePath: `mock/${file.name}`
    };
  }

  const fileName = `video_${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    throw new Error('Failed to get public URL for the uploaded video.');
  }

  return { publicUrl: data.publicUrl, filePath };
};

// Analyze video function with mock fallback
export const analyzeVideo = async (videoUrl: string): Promise<AnalysisResult> => {
  if (!supabase) {
    // Mock response for development
    console.log('Mock mode: Simulating video analysis');
    return mockAnalyzeVideo();
  }

  const { data, error } = await supabase.functions.invoke('analyze', {
    body: { videoUrl },
  });

  if (error) {
    throw new Error(`Analysis function failed: ${error.message}`);
  }

  return data as AnalysisResult;
};

// Save analysis result function with mock fallback
export const saveAnalysisResult = async (result: Omit<AnalysisResult, 'id' | 'timestamp'>): Promise<AnalysisResult> => {
  if (!supabase) {
    // Mock response for development
    console.log('Mock mode: Simulating save analysis result');
    return {
      ...result,
      id: `mock_${Date.now()}`,
      timestamp: new Date()
    } as AnalysisResult;
  }

  const { data, error } = await supabase
    .from('analysis_results')
    .insert([result])
    .select();

  if (error) {
    throw new Error(`Failed to save analysis result: ${error.message}`);
  }

  return data[0] as AnalysisResult;
};

// Get analysis history function with mock fallback
export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  if (!supabase) {
    // Mock response for development
    console.log('Mock mode: Returning empty history');
    return [];
  }

  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch analysis history: ${error.message}`);
  }

  return data as AnalysisResult[];
};

// Mock analysis function for development
const mockAnalyzeVideo = (): AnalysisResult => {
  return {
    id: `analysis_${Date.now()}`,
    timestamp: new Date(),
    filename: 'mock_video.mp4',
    spermCount: Math.floor(Math.random() * 50) + 20,
    speedAvg: Math.floor(Math.random() * 30) + 15,
    movementPattern: {
      progressif: Math.floor(Math.random() * 40) + 30,
      'non-progressif': Math.floor(Math.random() * 30) + 20,
      immobile: Math.floor(Math.random() * 20) + 10
    },
    concentration: Math.floor(Math.random() * 80) + 20,
    motility: Math.floor(Math.random() * 40) + 40,
    totalMotileCount: Math.floor(Math.random() * 100) + 50,
    morphology: {
      normal: Math.floor(Math.random() * 30) + 60,
      abnormal: Math.floor(Math.random() * 40) + 10
    },
    processingTime: 12
  };
};