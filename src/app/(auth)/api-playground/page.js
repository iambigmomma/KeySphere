'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiPlayground() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting API key:', apiKey);
      
      const response = await fetch('/api/validate-api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      console.log('Validation response:', data);
      
      sessionStorage.setItem('apiValidation', JSON.stringify({
        valid: data.valid,
        message: data.message,
        usage: data.usage
      }));

      router.push('/protected');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">API Key Validation</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              Enter API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full mt-1 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your API key here"
              required
            />
          </div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Validate API Key
          </button>
        </form>
      </div>
    </div>
  );
} 