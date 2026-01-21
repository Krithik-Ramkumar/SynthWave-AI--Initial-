'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const copy = useCallback(
    async (text: string, successMessage?: string) => {
      if (!navigator?.clipboard) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Clipboard API not available in this browser.',
        });
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast({
          title: 'Copied to clipboard!',
          description: successMessage || 'Content has been copied successfully.',
        });
        return true;
      } catch (error) {
        console.warn('Copy failed', error);
        toast({
          variant: 'destructive',
          title: 'Copy Failed',
          description: 'Could not copy content to clipboard.',
        });
        setCopiedText(null);
        return false;
      }
    },
    [toast]
  );

  return { copiedText, copy };
}