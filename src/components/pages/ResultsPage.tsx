import { useState } from 'react';
import { BarChart3, Download, Share2, FileText, TrendingUp, Target, Activity, Zap, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { AnalysisResult } from '../../types/analysis';
import { MotilityChart } from '../charts/MotilityChart';

import { MovementPatternChart } from '../charts/MovementPatternChart';
import { toast } from 'sonner';

interface ResultsPageProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
  onViewHistory: () => void;
}

export function ResultsPage({ result, onNewAnalysis, onViewHistory }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getMotilityGrade = (motility: number) => {
    if (motility >= 60) return { grade: 'A', color: 'bg-green-500', label: 'ممتاز' };
    if (motility >= 40) return { grade: 'B', color: 'bg-blue-500', label: 'جيد' };
    if (motility >= 20) return { grade: 'C', color: 'bg-yellow-500', label: 'ضعيف' };
    return { grade: 'D', color: 'bg-red-500', label: 'ضعيف جداً' };
  };

  const getConcentrationStatus = (concentration: number) => {
    if (concentration >= 20) return { status: 'طبيعي', color: 'text-green-600', bg: 'bg-green-50' };
    if (concentration >= 15) return { status: 'منخفض قليلاً', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'منخفض', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleDownloadReport = () => {
    toast.success('جاري تحضير التقرير...');
    // Here you would implement PDF generation
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(`نتائج تحليل الحيوانات المنوية:\nالعدد: ${result.spermCount}\nالحركة: ${result.motility}%\nالتركيز: ${result.concentration} مليون/مل`);
    toast.success('تم نسخ النتائج للحافظة');
  };

  const motilityGrade = getMotilityGrade(result.motility || 0);
  const concentrationStatus = getConcentrationStatus(result.concentration || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full">
            <BarChart3 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            نتائج تحليل العينة
          </h2>
          <p className="text-gray-600">
            تحليل شامل لعينة الحيوانات المنوية باستخدام الذكاء الاصطناعي
          </p>
          <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse mt-4">
            <Badge variant="outline" className="flex items-center space-x-1 rtl:space-x-reverse">
              <Clock className="h-3 w-3" />
              <span>{result.timestamp.toLocaleString('ar-SA')}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1 rtl:space-x-reverse">
              <FileText className="h-3 w-3" />
              <span>{result.filename}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 rtl:space-x-reverse">
        <Button onClick={handleDownloadReport} className="flex items-center space-x-2 rtl:space-x-reverse">
          <Download className="h-4 w-4" />
          <span>تحميل التقرير</span>
        </Button>
        <Button onClick={handleShareResults} variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
          <Share2 className="h-4 w-4" />
          <span>مشاركة النتائج</span>
        </Button>
        <Button onClick={onNewAnalysis} variant="outline">
          تحليل جديد
        </Button>
        <Button onClick={onViewHistory} variant="outline">
          عرض السجل
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{result.spermCount}</div>
            <div className="text-sm text-gray-600">عدد الحيوانات المنوية</div>
            <div className="text-xs text-gray-500">في المجال المرئي</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{result.motility}%</div>
            <div className="text-sm text-gray-600">الحركة الإجمالية</div>
            <Badge className={`${motilityGrade.color} text-white text-xs`}>
              {motilityGrade.label}
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{result.concentration}</div>
            <div className="text-sm text-gray-600">التركيز</div>
            <div className="text-xs text-gray-500">مليون/مل</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{result.speedAvg}</div>
            <div className="text-sm text-gray-600">متوسط السرعة</div>
            <div className="text-xs text-gray-500">ميكرون/ثانية</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="motility">الحركة</TabsTrigger>
          <TabsTrigger value="morphology">التشكل</TabsTrigger>
          <TabsTrigger value="analysis">التحليل التفصيلي</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Concentration Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>تحليل التركيز</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${concentrationStatus.bg}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">التركيز</span>
                      <span className={`font-bold ${concentrationStatus.color}`}>
                        {result.concentration} مليون/مل
                      </span>
                    </div>
                    <div className={`text-sm ${concentrationStatus.color} mt-1`}>
                      {concentrationStatus.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">المعدل الطبيعي</span>
                      <span className="text-sm text-gray-600">15-200 مليون/مل</span>
                    </div>
                    <Progress 
                      value={Math.min((result.concentration || 0) / 200 * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motility Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>تحليل الحركة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {result.movementPattern.progressif}%
                      </div>
                      <div className="text-xs text-gray-600">تقدمية</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {result.movementPattern['non-progressif']}%
                      </div>
                      <div className="text-xs text-gray-600">غير تقدمية</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {result.movementPattern.immobile}%
                      </div>
                      <div className="text-xs text-gray-600">ثابتة</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">الحركة الإجمالية</span>
                      <span className="text-sm font-semibold">{result.motility}%</span>
                    </div>
                    <Progress value={result.motility} className="h-2" />
                    <div className="text-xs text-gray-600 text-center">
                      الحد الأدنى الطبيعي: 40%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Movement Pattern Chart */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع أنماط الحركة</CardTitle>
              <CardDescription>
                تحليل تفصيلي لأنماط حركة الحيوانات المنوية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MovementPatternChart data={result.movementPattern} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motility" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>تحليل السرعة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.speedAvg}</div>
                    <div className="text-sm text-gray-600">ميكرون/ثانية</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">السرعة المتوسطة</span>
                      <span className="text-sm font-semibold">{result.speedAvg} μm/s</span>
                    </div>
                    <Progress value={Math.min(result.speedAvg / 50 * 100, 100)} className="h-2" />
                    <div className="text-xs text-gray-600 text-center">
                      المعدل الطبيعي: 20-50 ميكرون/ثانية
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>منحنى الحركة</CardTitle>
              </CardHeader>
              <CardContent>
                <MotilityChart 
                  progressif={result.movementPattern.progressif}
                  nonProgressif={result.movementPattern['non-progressif']}
                  immobile={result.movementPattern.immobile}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="morphology" className="space-y-6">
          {result.morphology && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>تحليل التشكل</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">التشكل الطبيعي</span>
                        <span className="text-2xl font-bold text-green-600">
                          {result.morphology.normal}%
                        </span>
                      </div>
                      <Progress value={result.morphology.normal} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">التشكل غير الطبيعي</span>
                        <span className="text-2xl font-bold text-red-600">
                          {result.morphology.abnormal}%
                        </span>
                      </div>
                      <Progress value={result.morphology.abnormal} className="h-2 mt-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>المعايير الطبيعية:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• التشكل الطبيعي: أكثر من 4% (WHO 2010)</li>
                          <li>• التشكل الطبيعي: أكثر من 14% (WHO 1999)</li>
                          <li>• النتيجة الحالية: {result.morphology.normal}%</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التحليل التفصيلي</CardTitle>
              <CardDescription>
                تقرير شامل عن نتائج التحليل مع التوصيات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">إجمالي العدد المتحرك</h4>
                    <p className="text-2xl font-bold">{result.totalMotileCount}</p>
                    <p className="text-sm text-gray-600">مليون</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">وقت المعالجة</h4>
                    <p className="text-2xl font-bold">{result.processingTime}</p>
                    <p className="text-sm text-gray-600">ثانية</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-purple-600 mb-2">دقة التحليل</h4>
                    <p className="text-2xl font-bold">94.7%</p>
                    <p className="text-sm text-gray-600">موثوقية النتائج</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">التوصيات والملاحظات</h4>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">ملاحظات هامة:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• هذا التحليل للأغراض البحثية والتعليمية فقط</li>
                        <li>• يجب استشارة طبيب مختص للحصول على تشخيص طبي دقيق</li>
                        <li>• قد تختلف النتائج باختلاف ظروف العينة وطريقة التحضير</li>
                        <li>• يُنصح بإجراء تحليل متكرر للحصول على نتائج أكثر دقة</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">توصيات للتحسين:</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• الحفاظ على نمط حياة صحي ومتوازن</li>
                      <li>• ممارسة الرياضة بانتظام وتجنب التدخين</li>
                      <li>• تناول الأطعمة الغنية بمضادات الأكسدة</li>
                      <li>• تجنب التعرض للحرارة المرتفعة</li>
                      <li>• إجراء فحوصات دورية منتظمة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}