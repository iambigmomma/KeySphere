'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const [validation, setValidation] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get validation result from sessionStorage
    const storedValidation = sessionStorage.getItem('apiValidation');
    if (storedValidation) {
      setValidation(JSON.parse(storedValidation));
      // Clear the stored validation after reading it
      sessionStorage.removeItem('apiValidation');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {validation && (
          <div
            className={`p-4 rounded-md ${
              validation.valid ? 'bg-green-50' : 'bg-red-50'
            } mb-4`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {validation.valid ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${validation.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {validation.message}
                </h3>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => router.push('/api-playground')}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to API Playground
        </button>
      </div>
    </div>
  );
} 