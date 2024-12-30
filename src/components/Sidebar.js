'use client';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import Link from 'next/link';
import { 
  HomeIcon, 
  BeakerIcon, 
  DocumentTextIcon, 
  CommandLineIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30">
        <div className={`
          h-full flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}
          bg-white border-r border-gray-200
        `}>
          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-4 p-1.5 rounded-full bg-white 
              shadow-lg border border-gray-200 hover:bg-gray-50"
            aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="flex items-center">
              <span className={`text-xl font-semibold text-gray-900 transition-opacity duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                KeySphere
              </span>
              <span className={`text-xl font-semibold text-gray-900
                ${isOpen ? 'hidden' : 'block'}
              `}>
                K
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-hidden">
            <Link 
              href="/dashboard" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <HomeIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                Overview
              </span>
            </Link>
            
            <Link 
              href="/research-assistant" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <BeakerIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                Research Assistant
              </span>
            </Link>

            <Link 
              href="/research-reports" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <DocumentTextIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                Research Reports
              </span>
            </Link>

            <Link 
              href="/api-playground" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <CommandLineIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                API Playground
              </span>
            </Link>

            <Link 
              href="/invoices" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <DocumentIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                Invoices
              </span>
            </Link>

            <Link 
              href="/documentation" 
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
            >
              <DocumentDuplicateIcon className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-500" />
              <span className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                Documentation
              </span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center px-3 py-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
              </div>
              <div className={`ml-3 transition-all duration-300
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
              `}>
                <p className="text-sm font-medium text-gray-700">User Name</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className={`
        flex-shrink-0
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
      `} />
    </>
  );
} 