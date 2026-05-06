import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/layout/main-layout";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <MainLayout />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors closeButton />
    </QueryClientProvider>
  ),
});
