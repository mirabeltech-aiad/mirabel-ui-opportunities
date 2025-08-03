import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import FormSection from '../../components/forms/FormSection';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  applicable_company_types: string[];
}

const ReportsByModel: React.FC = () => {
  const [allReports, setAllReports] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const { data, error } = await supabase
          .from('report_templates')
          .select('id, name, description, template_type, applicable_company_types')
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Error fetching reports:', error);
          return;
        }

        setAllReports(data || []);
      } catch (err) {
        console.error('Error in fetchAllReports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  const getReportIcon = (templateType: string) => {
    switch (templateType?.toLowerCase()) {
      case 'revenue':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'user':
      case 'subscriber':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'activity':
        return <Activity className="h-4 w-4 text-rose-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const saasReports = allReports.filter(report => 
    report.applicable_company_types?.includes('saas')
  );

  const mediaReports = allReports.filter(report => 
    report.applicable_company_types?.includes('media')
  );

  const universalReports = allReports.filter(report => 
    report.applicable_company_types?.includes('saas') && 
    report.applicable_company_types?.includes('media')
  );

  if (isLoading) {
    return (
      <FormSection title="Available Reports by Business Model" icon={<FileText className="h-5 w-5" />}>
        <div className="text-gray-500">Loading reports...</div>
      </FormSection>
    );
  }

  return (
    <FormSection title="Available Reports by Business Model" icon={<FileText className="h-5 w-5" />}>
      <div className="space-y-6">
        
        {/* Universal Reports */}
        {universalReports.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-ocean-800">Universal Reports</h3>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Available in both models
              </Badge>
            </div>
            <div className="grid gap-2">
              {universalReports.map((report) => (
                <div key={report.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                  {getReportIcon(report.template_type)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-600">{report.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SaaS Reports */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-ocean-800">SaaS Business Model</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {saasReports.filter(r => !universalReports.includes(r)).length} exclusive reports
            </Badge>
          </div>
          <div className="grid gap-2">
            {saasReports.filter(r => !universalReports.includes(r)).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-blue-50">
                {getReportIcon(report.template_type)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">{report.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Reports */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-ocean-800">Media Business Model</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {mediaReports.filter(r => !universalReports.includes(r)).length} exclusive reports
            </Badge>
          </div>
          <div className="grid gap-2">
            {mediaReports.filter(r => !universalReports.includes(r)).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-green-50">
                {getReportIcon(report.template_type)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">{report.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Your selected business model determines which reports are available in the Reports section. 
            Universal reports are available regardless of your business model selection.
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default ReportsByModel;