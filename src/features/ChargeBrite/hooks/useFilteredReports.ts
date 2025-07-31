import { useState, useEffect } from 'react';
import { useBusinessModel } from '../contexts/BusinessModelContext';
import { supabase } from '../integrations/supabase/client';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  audit_bureau?: string;
  template_config: any;
  parameters: any;
  applicable_company_types: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useFilteredReports = () => {
  const { businessModel, isLoading: businessModelLoading } = useBusinessModel();
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilteredReports = async () => {
      if (businessModelLoading) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('report_templates')
          .select('*')
          .eq('is_active', true)
          .contains('applicable_company_types', [businessModel])
          .order('name');

        if (fetchError) {
          console.error('Error fetching reports:', fetchError);
          setError(fetchError.message);
          return;
        }

        setReports(data || []);
      } catch (err) {
        console.error('Error in fetchFilteredReports:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredReports();
  }, [businessModel, businessModelLoading]);

  const refreshReports = () => {
    if (!businessModelLoading) {
      setIsLoading(true);
      // Re-trigger the effect by updating a dependency
      const fetchData = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('report_templates')
            .select('*')
            .eq('is_active', true)
            .contains('applicable_company_types', [businessModel])
            .order('name');

          if (fetchError) {
            setError(fetchError.message);
            return;
          }

          setReports(data || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  };

  return {
    reports,
    isLoading: isLoading || businessModelLoading,
    error,
    businessModel,
    refreshReports
  };
};