import { useState, useRef } from 'react';
import { Upload, FileVideo, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { AnalysisResult, AnalysisProgress } from '../../types/analysis';
import { toast } from 'sonner';

interface UploadPageProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export function UploadPage({ onAnalysisComplete }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('يرجى اختيار ملف فيديو صالح');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت');
      return;
    }

    setSelectedFile(file);
    toast.success('تم اختيار الملف بنجاح');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateAnalysis = async (): Promise<AnalysisResult> => {
    const stages = [
      { stage: 'uploading' as const, progress: 20, message: 'جاري رفع الفيديو...' },
      { stage: 'processing' as const, progress: 40, message: 'معالجة الفيديو...' },
      { stage: 'analyzing' as const, progress: 80, message: 'تحليل الحيوانات المنوية...' },
      { stage: 'complete' as const, progress: 100, message: 'اكتمل التحليل!' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(stage);
    }

    // Simulate realistic results
    const result: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      timestamp: new Date(),
      filename: selectedFile?.name || 'unknown.mp4',
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

    return result;
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await simulateAnalysis();
      onAnalysisComplete(result);
      toast.success('تم التحليل بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء التحليل');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FileVideo className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            تحليل عينة الحيوانات المنوية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            قم برفع فيديو العينة للحصول على تحليل شامل وفوري باستخدام تقنيات الذكاء الاصطناعي المتقدمة
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!isAnalyzing && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-4">
                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">
                        تم اختيار الملف بنجاح
                      </h3>
                      <p className="text-gray-600 mt-2">
                        <strong>اسم الملف:</strong> {selectedFile.name}
                      </p>
                      <p className="text-gray-600">
                        <strong>الحجم:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                      <Button onClick={handleAnalyze} size="lg" className="px-8">
                        <FileVideo className="h-5 w-5 ml-2" />
                        بدء التحليل
                      </Button>
                      <Button onClick={resetUpload} variant="outline" size="lg">
                        اختيار ملف آخر
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {dragActive ? 'إفلات الملف هنا' : 'اختر ملف الفيديو'}
                      </h3>
                      <p className="text-gray-500 mt-2">
                        اسحب وأفلت ملف الفيديو هنا أو انقر للاختيار
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button variant="outline" size="lg">
                        <Upload className="h-5 w-5 ml-2" />
                        اختيار ملف
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span>جاري التحليل...</span>
            </CardTitle>
            <CardDescription>
              يتم تحليل العينة باستخدام خوارزميات الذكاء الاصطناعي المتطورة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.message}</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-3" />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">مراحل التحليل:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className={`flex items-center space-x-2 rtl:space-x-reverse ${progress.stage === 'uploading' ? 'font-bold' : ''}`}>
                  <div className={`h-2 w-2 rounded-full ${progress.progress >= 20 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>رفع الفيديو</span>
                </div>
                <div className={`flex items-center space-x-2 rtl:space-x-reverse ${progress.stage === 'processing' ? 'font-bold' : ''}`}>
                  <div className={`h-2 w-2 rounded-full ${progress.progress >= 40 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>معالجة الفيديو</span>
                </div>
                <div className={`flex items-center space-x-2 rtl:space-x-reverse ${progress.stage === 'analyzing' ? 'font-bold' : ''}`}>
                  <div className={`h-2 w-2 rounded-full ${progress.progress >= 80 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>تحليل الحيوانات المنوية</span>
                </div>
                <div className={`flex items-center space-x-2 rtl:space-x-reverse ${progress.stage === 'complete' ? 'font-bold' : ''}`}>
                  <div className={`h-2 w-2 rounded-full ${progress.progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>إنهاء التحليل</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!isAnalyzing && !selectedFile && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Camera className="h-6 w-6 text-blue-600" />
                <span>متطلبات التصوير</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>استخدم تكبير 400x أو أعلى</span>
                </li>
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>تأكد من وضوح الصورة وثباتها</span>
                </li>
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>مدة التسجيل من 10-30 ثانية</span>
                </li>
                <li className="flex items-start space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>درجة حرارة العينة 37°C</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <span>ملاحظات مهمة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="space-y-1 text-sm">
                    <li>• الحد الأقصى لحجم الملف: 100 ميجابايت</li>
                    <li>• الصيغ المدعومة: MP4, AVI, MOV</li>
                    <li>• النتائج للأغراض البحثية فقط</li>
                    <li>• استشر طبيب مختص للتشخيص النهائي</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}