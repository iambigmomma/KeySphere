'use client';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/context/SidebarContext';

export default function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
      aria-label="Toggle Sidebar"
    >
      <Bars3Icon className="w-6 h-6" />
    </button>
  );
} 