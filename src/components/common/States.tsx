import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Info, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
      )}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  action, 
  className 
}: ErrorStateProps) {
  return (
    <Alert className={`border-red-200 ${className}`}>
      <XCircle className="h-4 w-4 text-red-500" />
      <AlertDescription>
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-red-800">{title}</p>
            <p className="text-red-700">{message}</p>
          </div>
          {action}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface SuccessStateProps {
  message: string;
  className?: string;
}

export function SuccessState({ message, className }: SuccessStateProps) {
  return (
    <Alert className={`border-green-200 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-green-700">
        {message}
      </AlertDescription>
    </Alert>
  );
}

interface WarningStateProps {
  message: string;
  className?: string;
}

export function WarningState({ message, className }: WarningStateProps) {
  return (
    <Alert className={`border-yellow-200 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-700">
        {message}
      </AlertDescription>
    </Alert>
  );
}
