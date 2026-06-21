import { create } from 'zustand';
import { auth } from '../firebase';
import API_BASE_ROOT from '../config/api';

const API_BASE = `${API_BASE_ROOT}/api/v1`;

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,

  // Retrieve Firebase ID token safely
  getAuthToken: async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  },

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await get().getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/chat/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch chats");
      
      const data = await res.json();
      set({ chats: data.sessions || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: error.message, isLoading: false });
    }
  },

  createChat: async () => {
    try {
      const token = await get().getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/chat/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to create chat");
      
      const data = await res.json();
      set({ activeChatId: data.chat_id });
      await get().fetchChats();
      return data.chat_id;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
  },

  deleteChat: async (chatId) => {
    try {
      const token = await get().getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/chat/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        set(state => ({ 
          chats: state.chats.filter(c => c._id !== chatId),
          activeChatId: state.activeChatId === chatId ? null : state.activeChatId 
        }));
      }
    } catch (error) {
      console.error("Delete chat failed", error);
    }
  },

  deleteAllChats: async () => {
    try {
      const token = await get().getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/chat/chats`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        set({ chats: [], activeChatId: null });
      }
    } catch (error) {
      console.error("Delete all chats failed", error);
    }
  },

  updateChatTitle: async (chatId, newTitle) => {
    try {
      const token = await get().getAuthToken();
      if (!token) return;

      await fetch(`${API_BASE}/chat/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      set(state => ({
        chats: state.chats.map(c => c._id === chatId ? { ...c, title: newTitle } : c)
      }));
    } catch (error) {
      console.error("Update title failed", error);
    }
  },
  
  pinChat: async (chatId, isPinned) => {
    try {
      const token = await get().getAuthToken();
      if (!token) return;

      await fetch(`${API_BASE}/chat/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_pinned: isPinned })
      });
      
      set(state => ({
        chats: state.chats.map(c => c._id === chatId ? { ...c, is_pinned: isPinned } : c)
      }));
    } catch (error) {
      console.error("Pin chat failed", error);
    }
  }
}));
