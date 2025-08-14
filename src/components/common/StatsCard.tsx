import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FontWeights } from '@/lib/styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export function StatsCard({ title, value, description, trend, icon: Icon }: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.isPositive) return <TrendingUp className="h-3 w-3" />;
    if (trend.value === 0) return <Minus className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.isPositive) return 'text-green-600';
    if (trend.value === 0) return 'text-gray-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`${FontWeights.MEDIUM} text-sm`}>{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={`${FontWeights.BOLD} text-2xl`}>{value}</div>
        <div className={`${FontWeights.REGULAR} flex items-center gap-2 text-xs text-muted-foreground`}>
          {description && <span>{description}</span>}
          {trend && (
            <Badge variant="secondary" className={`${getTrendColor()} ${FontWeights.MEDIUM} flex items-center gap-1`}>
              {getTrendIcon()}
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
