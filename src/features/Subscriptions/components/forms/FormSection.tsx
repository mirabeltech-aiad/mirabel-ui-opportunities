
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  className,
  children
}) => {
  return (
    <Card className={cn("border-gray-200 shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ocean-800 flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
