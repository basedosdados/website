import { useEffect, useState } from 'react';
import cookies from 'js-cookie';

export default function useABTestVariant(testId = 'default-abtest', variants = ['A', 'B']) {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    let abVariant = cookies.get(testId);
    if (!abVariant || !variants.includes(abVariant)) {
      abVariant = variants[Math.floor(Math.random() * variants.length)];
      cookies.set(testId, abVariant, { expires: 365 });
    }
    setVariant(abVariant);
  }, [testId, variants]);

  return variant;
} 