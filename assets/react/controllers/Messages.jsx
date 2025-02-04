import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const Messages = () => {
  const { token, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { label: 'Messages' }
  ];

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });
        const data = await response.json();
        setChats(data.chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChats();
    }
  }, [token]);

  const handleNewMessage = (message) => {
    // Create a new message object with all required fields
    const newMessage = {
      ...message,
      sender: user,
      formattedCreatedAt: new Date().toISOString()
    };

    // Update the selected chat first
    if (selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        formattedUpdatedAt: newMessage.formattedCreatedAt
      };
      setSelectedChat(updatedChat);
    }

    // Update the chats list
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === message.chat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            formattedUpdatedAt: newMessage.formattedCreatedAt
          };
        }
        return chat;
      }).sort((a, b) => new Date(b.formattedUpdatedAt) - new Date(a.formattedUpdatedAt))
    );
  };

  if (!token) {
    return (
      <Layout needAuthentication={true}>
        <div className="text-center py-8">Please log in to view your messages.</div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r">
            <ChatList 
              chats={chats} 
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
          </div>
          
          {/* Chat Window */}
          <div className="w-2/3">
            {selectedChat ? (
              <ChatWindow 
                chat={selectedChat} 
                onMessageSent={handleNewMessage}
                key={selectedChat.id} // Add key to force re-render on chat change
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
