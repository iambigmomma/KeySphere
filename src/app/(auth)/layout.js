'use client';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';

export default function AuthLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <div className="pl-16 min-h-screen bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 