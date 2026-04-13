import { useState } from 'react';

export function useAsync() {
  const [isLoading, setIsLoading] = useState(false);

  async function run<T>(callback: () => Promise<T>) {
    setIsLoading(true);
    try {
      return await callback();
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, run };
}
