import { useEffect, useState } from 'react';
import cookies from 'js-cookie';

export default function useABTestVariant(
  testId = 'default-abtest',
  variants = ['A', 'B'],
  expires = 365,
) {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    let abVariant = cookies.get(testId);
    if (!abVariant || !variants.includes(abVariant)) {
      abVariant = variants[Math.floor(Math.random() * variants.length)];
      cookies.set(testId, abVariant, { expires });
    }
    setVariant(abVariant);
  }, [testId, variants, expires]);

  return variant;
} 