import React from 'react';
import useAuth from '../../hooks/useAuth';

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  const { user } = useAuth();

  const getOtherParticipant = (chat) => {
    if (!chat?.participants || !user) return null;
    return chat.participants.find(p => p.id !== user.id);
  };

  const formatDate = (chat) => {
    try {
      const dateStr = chat.formattedUpdatedAt || chat.lastMessage?.formattedCreatedAt;
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';

      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats
          .sort((a, b) => new Date(b.formattedUpdatedAt) - new Date(a.formattedUpdatedAt))
          .map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            return (
              <div
                key={chat.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {otherParticipant?.profilePicture && (
                      <img
                        src={otherParticipant.profilePicture}
                        alt={`${otherParticipant.firstName}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {otherParticipant ? 
                          `${otherParticipant.firstName} ${otherParticipant.lastName}` : 
                          'Unknown User'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(chat)}
                      </span>
                    </div>
                    {chat.messages.length > 0 && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.messages[chat.messages.length - 1].content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default ChatList;
