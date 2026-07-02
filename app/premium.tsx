import { useState } from 'react';
import { useRouter } from 'expo-router';

import { PaywallScreen } from '@/components/premium';

export default function PremiumScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  return (
    <PaywallScreen
      visible={visible}
      triggerContext="generic"
      onClose={handleClose}
    />
  );
}
