import React, { useEffect, useState, useRef } from "react";
import "./CopilotSidebar.css";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../../store/chatStore";
import {
  Plus, Bookmark, FolderOpen, Trash2, Search, Archive,
  Settings, FileText, MoreHorizontal, Pencil
} from "lucide-react";
import Logo from "../Logo";

export default function CopilotSidebar({ open, isMobile, onToggle }) {
  const { chats, activeChatId, setActiveChat, createChat } = useChatStore();
  const recentChats = chats.slice(0, 20);

  const groupedChats = chats.reduce((acc, chat) => {
    // Basic heuristic: just split the array since we don't have perfect timestamps handy
    // In a real app, use chat.created_at
    acc['Today'] = acc['Today'] || [];
    acc['Today'].push(chat);
    return acc;
  }, {});
  
  // Real date grouping
  const getGroup = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) return "Today";
    if (date >= yesterday) return "Yesterday";
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    if (date >= sevenDaysAgo) return "Previous 7 Days";
    return "Older";
  };

  const groups = { "Today": [], "Yesterday": [], "Previous 7 Days": [], "Older": [] };
  chats.forEach(chat => {
    const g = getGroup(chat.updated_at || chat.created_at);
    if (groups[g]) groups[g].push(chat);
    else groups["Recent"] = (groups["Recent"] || []).concat(chat);
  });

  return (
    <div className={`cgpt-sidebar-inner ${!open ? "collapsed" : ""}`}>
      {/* ── Header ── */}
      <div className="cgpt-sidebar-header">
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cgpt-sidebar-title"
          >
            CareerGPT
          </motion.span>
        )}
        <button onClick={onToggle} className="cgpt-sidebar-toggle" title="Toggle sidebar" style={{ background: 'transparent', border: 'none', padding: '4px' }}>
          <Logo style={{ '--logo-size': '20px' }} />
        </button>
      </div>

      {/* ── New Chat ── */}
      <div className="cgpt-sidebar-section">
        <SidebarItem
          onClick={() => createChat("New Conversation")}
          icon={<Plus size={16} />}
          label="New Chat"
          open={open}
        />
        <SidebarItem icon={<Search size={16} />} label="Search" open={open} />
      </div>

      {/* ── Chat History ── */}
      <div className="cgpt-sidebar-history">
        {open && Object.entries(groups).map(([groupName, groupChats]) => {
          if (groupChats.length === 0) return null;
          return (
            <div key={groupName}>
              <div className="cgpt-sidebar-label">{groupName}</div>
              {groupChats.map((chat) => (
                <ChatRow
                  key={chat.id || chat._id}
                  chat={chat}
                  isActive={chat.id === activeChatId || chat._id === activeChatId}
                  onClick={() => setActiveChat(chat.id || chat._id)}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="cgpt-sidebar-footer">
        <SidebarItem icon={<Trash2 size={16} />} label="Clear all chats" open={open} onClick={() => {
          if (window.confirm("Are you sure you want to delete all chats? This cannot be undone.")) {
            useChatStore.getState().deleteAllChats();
          }
        }} />
        <SidebarItem icon={<Settings size={16} />} label="Settings" open={open} />
      </div>
    </div>
  );
}

/* ── Sidebar Item ── */
function SidebarItem({ icon, label, onClick, open, active }) {
  return (
    <div onClick={onClick} title={label} className={`cgpt-sidebar-item ${active ? "active" : ""}`}>
      <span className="cgpt-sidebar-item-icon">{icon}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="cgpt-sidebar-item-label"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Chat Row ── */
function ChatRow({ chat, active, onClick, open }) {
  const { updateChatTitle, deleteChat } = useChatStore();
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(chat.title || "New Conversation");
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (renaming && inputRef.current) inputRef.current.focus();
  }, [renaming]);

  const submitRename = (e) => {
    e?.preventDefault();
    if (name.trim() && name !== chat.title) updateChatTitle(chat._id, name.trim());
    setRenaming(false);
  };

  return (
    <div
      onClick={onClick}
      className={`cgpt-chat-row ${active ? "active" : ""}`}
      title={chat.title || "New Conversation"}
    >
      <FileText size={15} className="cgpt-chat-row-icon" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="cgpt-chat-row-body"
          >
            {renaming ? (
              <form onSubmit={submitRename} onClick={(e) => e.stopPropagation()}>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={submitRename}
                  className="cgpt-chat-row-rename-input"
                />
              </form>
            ) : (
              <span className="cgpt-chat-row-title">{chat.title || "New Conversation"}</span>
            )}

            {!renaming && (
              <button
                onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); }}
                className="cgpt-chat-row-menu-trigger"
              >
                <MoreHorizontal size={14} />
              </button>
            )}

            {menu && (
              <div ref={menuRef} className="cgpt-chat-row-menu">
                <button
                  className="cgpt-menu-item"
                  onClick={(e) => { e.stopPropagation(); setRenaming(true); setMenu(false); }}
                >
                  <Pencil size={14} /> Rename
                </button>
                <div className="cgpt-menu-divider" />
                <button
                  className="cgpt-menu-item danger"
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); setMenu(false); }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
