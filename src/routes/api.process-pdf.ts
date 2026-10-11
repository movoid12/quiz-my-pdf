import { createFileRoute } from '@tanstack/react-router';
import { handleProcessPdf } from '@/server/process-pdf';

export const Route = createFileRoute('/api/process-pdf')({
  server: {
    handlers: {
      POST: ({ request }) => handleProcessPdf(request),
    },
  },
});
