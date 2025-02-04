import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';

const PropertyDrafts = () => {
  const { token } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, draftId: null });

  const breadcrumbs = [
    { label: "Your Profile", href: "/profile" },
    { label: "Property Drafts" }
  ];

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await fetch('/api/drafts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });
        const data = await response.json();
        setDrafts(data.drafts);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDrafts();
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (draftId) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        setDrafts(drafts.filter(draft => draft.id !== draftId));
        setDeleteModal({ show: false, draftId: null });
      } else {
        throw new Error('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (!token) {
    return (
      <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
        <div className="text-center py-8">Please log in to view your drafts.</div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="p-8 text-center">Loading drafts...</div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Your Property Drafts</h1>
        
        {drafts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-medium mb-2">No drafts found</h2>
            <p className="text-gray-600 mb-4">Start creating a new property listing</p>
            <a 
              href="/become-a-host"
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
            >
              Become a Host
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {drafts.map((draft) => (
              <div 
                key={draft.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">
                        {draft.data.title || 'Untitled Property'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Step {draft.currentStep} of 8
                      </p>
                      <div className="text-sm text-gray-500">
                        Last saved: {formatDate(draft.lastSaved)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setDeleteModal({ show: true, draftId: draft.id })}
                        disabled={deleting}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete draft"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                      <a 
                        href={`/drafts/${draft.id}`}
                        className="flex items-center gap-2 text-rose-600"
                      >
                        Continue
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Draft</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this draft? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, draftId: null })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.draftId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropertyDrafts;
