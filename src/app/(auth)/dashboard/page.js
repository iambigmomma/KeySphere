'use client';
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon, ClipboardIcon, TrashIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import Toast from '@/components/Toast';
import ConfirmationModal from '@/components/ConfirmationModal';

function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    value: '',
    usage: 0,
    limit: 1000
  });
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: '',
    confirmStyle: '',
    icon: null
  });

  // Fetch API keys from Supabase
  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      alert('Error loading API keys: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Generate a unique API key value
  function generateApiKey() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'neimuc-';
    let result = prefix;
    
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    if (!visibleKeys[id]) {
      showToast('API key is now visible', 'info');
      setTimeout(() => {
        setVisibleKeys(prev => ({
          ...prev,
          [id]: false
        }));
        showToast('API key hidden for security', 'info');
      }, 10000);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 3000);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('API key copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy API key', 'error');
    }
  };

  const handleCreateNewKey = async () => {
    if (!newKeyData.name.trim()) {
      showToast('Please enter a key name', 'error');
      return;
    }

    try {
      const newKey = {
        name: newKeyData.name,
        value: generateApiKey(),
        usage: 0
      };

      console.log('Attempting to create new key:', newKey);

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully created key:', data);
      setApiKeys(prev => [data, ...prev]);
      setNewKeyData({ name: '', value: '', usage: 0, limit: 1000 });
      setIsCreateModalOpen(false);
      showToast('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      showToast(`Error creating API key: ${error.message}`, 'error');
    }
  };

  const handleRegenerateKey = (id) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Regenerate API Key',
      message: 'Are you sure you want to regenerate this API key? The old key will stop working immediately.',
      confirmText: 'Regenerate',
      confirmStyle: 'bg-indigo-600 hover:bg-indigo-700',
      onConfirm: async () => {
        try {
          const newValue = generateApiKey();
          const { error } = await supabase
            .from('api_keys')
            .update({ value: newValue })
            .eq('id', id);

          if (error) throw error;

          setApiKeys(prev => prev.map(key => 
            key.id === id ? { ...key, value: newValue } : key
          ));
          showToast('API key regenerated successfully');
        } catch (error) {
          console.error('Error regenerating API key:', error);
          showToast(`Error regenerating API key: ${error.message}`, 'error');
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteKey = (id) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete API Key',
      message: 'Are you sure you want to delete this API key? This action cannot be undone.',
      confirmText: 'Delete',
      confirmStyle: 'bg-red-600 hover:bg-red-700',
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id);

          if (error) throw error;

          setApiKeys(prev => prev.filter(key => key.id !== id));
          showToast('API key deleted successfully', 'error');
        } catch (error) {
          console.error('Error deleting API key:', error);
          showToast(`Error deleting API key: ${error.message}`, 'error');
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleLimitChange = (e) => {
    const value = e.target.value;
    const numericValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    setNewKeyData(prev => ({
      ...prev,
      limit: numericValue
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">KeySphere Dashboard</h1>
              <div className="mt-2">
                <h2 className="text-sm font-medium text-indigo-100">API Keys Overview</h2>
                <div className="mt-1">
                  <div className="w-64 h-2 bg-indigo-200/30 rounded-full">
                    <div 
                      className="h-2 bg-white rounded-full"
                      style={{ width: `${(apiKeys.reduce((sum, key) => sum + key.usage, 0) / 2000) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">
                    {apiKeys.reduce((sum, key) => sum + key.usage, 0)} Total Requests
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              + Create New Key
            </button>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your API keys and monitor their usage.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apiKey.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apiKey.usage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {visibleKeys[apiKey.id] ? apiKey.value : `${apiKey.value.substring(0, 8)}${'•'.repeat(24)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={visibleKeys[apiKey.id] ? "Hide API Key" : "Show API Key"}
                        >
                          {visibleKeys[apiKey.id] ? 
                            <EyeSlashIcon className="w-5 h-5" /> : 
                            <EyeIcon className="w-5 h-5" />
                          }
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.value)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          <ClipboardIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRegenerateKey(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Regenerate API key"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Delete API key"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create New API Key Modal */}
      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setIsCreateModalOpen(false)}
        >
          {/* Modal Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          {/* Modal Content */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Create a new API key
                  </Dialog.Title>
                  
                  <div className="mt-2 space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter a name and limit for the new API key.
                    </p>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Key Name — A unique name to identify this key
                      </label>
                      <input
                        type="text"
                        value={newKeyData.name}
                        onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter key name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          text-gray-900 placeholder-gray-400
                          text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="limitUsage"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={true}
                          readOnly
                        />
                        <label htmlFor="limitUsage" className="ml-2 block text-sm font-semibold text-gray-800">
                          Limit monthly usage*
                        </label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={newKeyData.limit}
                        onChange={handleLimitChange}
                        placeholder="Enter usage limit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          text-gray-900 placeholder-gray-400
                          text-base"
                      />
                      <p className="text-xs text-gray-600">
                        *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 
                        px-4 py-2 text-sm font-medium text-gray-700 
                        hover:bg-gray-50 hover:border-gray-400
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                        transition-colors"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent 
                        bg-indigo-600 px-4 py-2 text-sm font-medium text-white 
                        hover:bg-indigo-700 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                        transition-colors"
                      onClick={handleCreateNewKey}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Update the Toast implementation */}
      <Transition
        show={toast.visible}
        as={Fragment}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Toast message={toast.message} type={toast.type} />
      </Transition>

      {/* Add the confirmation modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        confirmText={confirmationModal.confirmText}
        confirmStyle={confirmationModal.confirmStyle}
        icon={confirmationModal.icon}
      />
    </div>
  );
}

export default Dashboard; 