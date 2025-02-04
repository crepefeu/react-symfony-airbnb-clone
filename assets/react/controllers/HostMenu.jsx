import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';

const HostMenu = () => {
  const { token } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);

  const breadcrumbs = [
    { label: "Your Profile", href: "/profile" },
    { label: "Become a Host" }
  ];

  const createNewDraft = async () => {
    try {
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      window.location.href = `/drafts/${data.draftId}`;
    } catch (error) {
      console.error('Error creating draft:', error);
    }
  };

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await fetch('/api/drafts', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include' // Add this
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data.drafts)) {
          setDrafts(data.drafts);
        } else {
          console.error('Drafts is not an array:', data.drafts);
          setDrafts([]);
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDrafts();
    }
  }, [token]);

  if (!token) {
    return (
      <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
        <div className="text-center py-8">
          <p className="mb-4">Please log in to manage your listings.</p>
          <button
            onClick={() => setIsLogInModalOpen(true)}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
          >
            Log in
          </button>
          <AuthModal
            isOpen={isLogInModalOpen}
            onClose={() => setIsLogInModalOpen(false)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Become a Host</h1>
          <button
            onClick={createNewDraft}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
          >
            Start New Listing
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">
                      {draft.data.title || 'Untitled Property'}
                    </h3>
                    <p className="text-gray-600 text-sm">Last edited {new Date(draft.lastSaved).toLocaleDateString()}</p>
                  </div>
                  <a
                    href={`drafts/${draft.id}`}
                    className="text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Continue
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HostMenu;
