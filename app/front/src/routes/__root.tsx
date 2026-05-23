import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
  component: () => (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <AppShell />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </NuqsAdapter>
  ),
});
