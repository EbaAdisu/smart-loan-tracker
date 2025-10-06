import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useTopLoader = () => {
  const router = useRouter();

  const startLoading = useCallback(() => {
    // Custom logic for starting loading
    // nextjs-toploader handles this automatically, but you can add custom behavior
    console.log('Loading started');
  }, []);

  const stopLoading = useCallback(() => {
    // Custom logic for stopping loading
    console.log('Loading completed');
  }, []);

  return { startLoading, stopLoading };
};
