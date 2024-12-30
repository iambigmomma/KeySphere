'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Toast from '@/components/Toast';
import { KeyIcon } from '@heroicons/react/24/outline';

export default function APIPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }

    setIsValidating(true);
    try {
      // Query Supabase to check if the API key exists and is valid
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, value')
        .eq('value', apiKey.trim());

      if (error) {
        console.error('Supabase error:', error);
        showToast(`Error: ${error.message}`, 'error');
        return;
      }

      // Check if we got any matching API keys
      if (data && data.length > 0) {
        showToast('✓ API key is valid and active', 'success');
      } else {
        showToast('✕ Invalid or inactive API key', 'error');
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateApiKey();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">API Key Playground</h1>
          <p className="text-indigo-100">
            Test and validate your API keys in a secure environment
          </p>
        </div>

        {/* Validation Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">API Key</span>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your API key (e.g., tvly-xxxxxxxxxxxxxxxx)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    pr-10 font-mono"
                />
                <KeyIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter your API key to validate its status and access level
              </p>
            </label>

            <button
              onClick={validateApiKey}
              disabled={isValidating}
              className={`w-full px-4 py-3 rounded-lg text-white font-medium
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isValidating 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {isValidating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : (
                'Validate API Key'
              )}
            </button>
          </div>

          {/* Example Usage Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Example Usage</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {`curl -X GET "https://api.keysphere.com/v1/data" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  );
} 