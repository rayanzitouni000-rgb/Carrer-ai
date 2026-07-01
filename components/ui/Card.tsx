import { ComponentProps } from 'react';

import { Card as DSCard, legacyPaddingMap, LoadingSpinner } from '@/design-system';

type LegacyPadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LegacyCardProps extends Omit<ComponentProps<typeof DSCard>, 'padding'> {
  padding?: LegacyPadding | ComponentProps<typeof DSCard>['padding'];
}

export function Card({ padding = '4', ...props }: LegacyCardProps) {
  const resolvedPadding =
    typeof padding === 'string' && padding in legacyPaddingMap
      ? legacyPaddingMap[padding as LegacyPadding]
      : (padding as ComponentProps<typeof DSCard>['padding']);

  return <DSCard padding={resolvedPadding} {...props} />;
}

export { LoadingSpinner as Loading };
