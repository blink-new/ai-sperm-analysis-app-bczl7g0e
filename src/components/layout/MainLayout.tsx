import { ReactNode } from 'react';
import { Microscope, Upload, BarChart3, History, FlaskConical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: 'upload' | 'results' | 'history';
  onNavigate: (page: 'upload' | 'results' | 'history') => void;
  hasResults: boolean;
}

export function MainLayout({ children, currentPage, onNavigate, hasResults }: MainLayoutProps) {
  const navItems = [
    {
      id: 'upload' as const,
      label: 'رفع العينة',
      labelEn: 'Upload Sample',
      icon: Upload,
      description: 'تحليل عينة جديدة'
    },
    {
      id: 'results' as const,
      label: 'النتائج',
      labelEn: 'Results',
      icon: BarChart3,
      description: 'عرض نتائج التحليل',
      disabled: !hasResults
    },
    {
      id: 'history' as const,
      label: 'السجل',
      labelEn: 'History',
      icon: History,
      description: 'تاريخ التحليلات',
      disabled: !hasResults
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative">
                <FlaskConical className="h-8 w-8 text-blue-600" />
                <Microscope className="h-4 w-4 text-green-600 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  تحليل الحيوانات المنوية بالذكاء الاصطناعي
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Sperm Analysis System</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">متصل</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-1 rtl:space-x-reverse py-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              const isDisabled = item.disabled;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="lg"
                  onClick={() => !isDisabled && onNavigate(item.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-white hover:bg-white/10'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                  `}
                >
                  <IconComponent className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs opacity-75">{item.labelEn}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="medical-card border-0 shadow-2xl">
          <div className="p-8">
            {children}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              تطبيق تحليل الحيوانات المنوية بالذكاء الاصطناعي - نظام طبي متقدم لتحليل الخصوبة
            </p>
            <p className="text-xs mt-2 text-gray-500">
              AI-Powered Sperm Analysis System - Advanced Medical Fertility Analysis Tool
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}