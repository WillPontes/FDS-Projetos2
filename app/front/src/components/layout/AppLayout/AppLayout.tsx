import { useState, type ReactNode } from "react";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useWebsocketNotification } from "@/hooks/useWebsocketNotification"

type AppLayoutProps = {
  children: ReactNode;
  userId?: number | null;
};

export const AppLayout = ({ children, userId = null }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  useWebsocketNotification(userId ?? null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
