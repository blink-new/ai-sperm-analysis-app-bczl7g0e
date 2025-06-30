import { useState } from 'react';
import { History, Calendar, FileText, Eye, Trash2, Download, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';
import { AnalysisResult } from '../../types/analysis';

interface AnalysisHistoryProps {
  history: AnalysisResult[];
  onNewAnalysis: () => void;
  onViewResult: (result: AnalysisResult) => void;
}

export function AnalysisHistory({ history, onNewAnalysis, onViewResult }: AnalysisHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'filename' | 'motility'>('date');

  const filteredHistory = history
    .filter(result => 
      result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'filename':
          return a.filename.localeCompare(b.filename);
        case 'motility':
          return (b.motility || 0) - (a.motility || 0);
        default:
          return 0;
      }
    });

  const getMotilityBadge = (motility?: number) => {
    if (!motility) return <Badge variant="secondary">غير محدد</Badge>;
    if (motility >= 60) return <Badge className="bg-green-500">ممتاز ({motility}%)</Badge>;
    if (motility >= 40) return <Badge className="bg-blue-500">جيد ({motility}%)</Badge>;
    if (motility >= 20) return <Badge className="bg-yellow-500">ضعيف ({motility}%)</Badge>;
    return <Badge className="bg-red-500">ضعيف جداً ({motility}%)</Badge>;
  };

  const handleDeleteAnalysis = (id: string) => {
    // Here you would implement delete functionality
    console.log('Delete analysis:', id);
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 rounded-full">
            <History className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          لا توجد تحليلات سابقة
        </h2>
        <p className="text-gray-600 mb-8">
          ابدأ بإجراء تحليل جديد لعرض النتائج هنا
        </p>
        <Button onClick={onNewAnalysis} size="lg">
          إجراء تحليل جديد
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-purple-100 rounded-full">
            <History className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            سجل التحليلات
          </h2>
          <p className="text-gray-600">
            عرض وإدارة جميع التحليلات السابقة
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في التحليلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-3"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'filename' | 'motility')}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="date">ترتيب بالتاريخ</option>
            <option value="filename">ترتيب بالاسم</option>
            <option value="motility">ترتيب بالحركة</option>
          </select>
        </div>
        
        <Button onClick={onNewAnalysis} className="w-full md:w-auto">
          تحليل جديد
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{history.length}</div>
            <div className="text-sm text-gray-600">إجمالي التحليلات</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(history.reduce((acc, h) => acc + (h.motility || 0), 0) / history.length)}%
            </div>
            <div className="text-sm text-gray-600">متوسط الحركة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(history.reduce((acc, h) => acc + (h.concentration || 0), 0) / history.length)}
            </div>
            <div className="text-sm text-gray-600">متوسط التركيز</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {history.filter(h => (h.motility || 0) >= 40).length}
            </div>
            <div className="text-sm text-gray-600">نتائج طبيعية</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>جدول التحليلات</CardTitle>
          <CardDescription>
            قائمة مفصلة بجميع التحليلات المجراة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">اسم الملف</TableHead>
                  <TableHead className="text-right">العدد</TableHead>
                  <TableHead className="text-right">الحركة</TableHead>
                  <TableHead className="text-right">التركيز</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {result.timestamp.toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString('ar-SA')}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">
                          {result.filename.length > 20 
                            ? `${result.filename.substring(0, 20)}...` 
                            : result.filename}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-semibold">{result.spermCount}</span>
                    </TableCell>
                    
                    <TableCell>
                      {getMotilityBadge(result.motility)}
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-semibold">
                        {result.concentration} <span className="text-xs text-gray-500">مليون/مل</span>
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      {(result.motility || 0) >= 40 ? (
                        <Badge className="bg-green-100 text-green-800">طبيعي</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">يحتاج متابعة</Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewResult(result)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAnalysis(result.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <Alert>
                <Search className="h-4 w-4" />
                <AlertDescription>
                  لم يتم العثور على نتائج تطابق البحث "{searchTerm}"
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}