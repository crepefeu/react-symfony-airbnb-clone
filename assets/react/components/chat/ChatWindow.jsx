import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const ChatWindow = ({ chat, onMessageSent }) => {
  const { token, user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(chat.messages || []);
  const [imagePreview, setImagePreview] = useState(null);  // Add this line
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Update local messages when chat changes
  useEffect(() => {
    setMessages(chat.messages || []);
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e) => {  // Add this function
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !fileInputRef.current?.files[0]) || !chat?.participants) return;

    const recipient = chat.participants.find(p => p.id !== user?.id);
    if (!recipient) return;

    const formData = new FormData();
    if (newMessage.trim()) {
      formData.append('content', newMessage);
    }
    const messageContent = newMessage;
    setNewMessage('');

    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append('file', file);
      fileInputRef.current.value = '';
      setImagePreview(null);
    }

    try {
      const response = await fetch(`/api/messages/send/${recipient.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update local state with the new message including media URL
      const newMessageObj = {
        ...data,
        chat: chat.id,
        sender: user,
        formattedCreatedAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessageObj]);
      onMessageSent(newMessageObj);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent);
    }
  };

  const getOtherParticipant = () => {
    if (!chat?.participants || !user) return null;
    return chat.participants.find(p => p.id !== user.id) || null;
  };

  const formatMessageTime = (message) => {
    try {
      const dateStr = message.formattedCreatedAt;
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {getOtherParticipant()?.firstName || 'Loading...'}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender?.id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender?.id === user?.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.mediaUrl && (
                      <img
                        src={message.mediaUrl}
                        alt="Attached media"
                        className="max-w-full rounded-lg mb-2"
                      />
                    )}
                    <p>{message.content}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {formatMessageTime(message)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        {imagePreview && (
          <div className="mb-2 relative">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                fileInputRef.current.value = '';
              }}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
