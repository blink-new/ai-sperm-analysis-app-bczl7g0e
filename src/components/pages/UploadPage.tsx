import { useState, useRef } from 'react';
import { Upload, FileVideo, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { AnalysisResult, AnalysisProgress } from '../../types/analysis';
import { uploadVideo, analyzeVideo } from '../../services/supabase';
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
    if (!file.type.startsWith('video/')) {
      toast.error('يرجى اختيار ملف فيديو صالح');
      return;
    }

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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress({ stage: 'uploading', progress: 0, message: 'جاري رفع الفيديو...' });

    try {
      // Upload video
      setProgress({ stage: 'uploading', progress: 30, message: 'جاري رفع الفيديو...' });
      const { publicUrl } = await uploadVideo(selectedFile);
      
      // Process video
      setProgress({ stage: 'processing', progress: 50, message: 'معالجة الفيديو...' });
      
      // Analyze video
      setProgress({ stage: 'analyzing', progress: 80, message: 'تحليل الحيوانات المنوية...' });
      const result = await analyzeVideo(publicUrl);
      
      // Complete
      setProgress({ stage: 'complete', progress: 100, message: 'اكتمل التحليل!' });
      
      // Add filename if not present
      if (!result.filename) {
        result.filename = selectedFile.name;
      }
      
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

      {!isAnalyzing && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
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
                <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {dragActive ? 'إفلات الملف هنا' : 'اختر ملف الفيديو'}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    اسحب وأفلت ملف الفيديو هنا أو انقر للاختيار
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFile && !isAnalyzing && (
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-semibold">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
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
      )}

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
          </CardContent>
        </Card>
      )}

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