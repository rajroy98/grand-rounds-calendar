'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isMe: boolean;
}

interface UserInfo {
    name: string;
    email: string;
}

import { supabase } from '@/lib/supabase';

export default function ChatInterface() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load user info from local storage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('chat_user_info');
        if (savedUser) {
            setUserInfo(JSON.parse(savedUser));
        }
    }, []);

    // Real-time subscription and fetching
    useEffect(() => {
        if (!userInfo) return;

        // Fetch last 7 days of messages
        const fetchMessages = async () => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .gt('created_at', oneWeekAgo.toISOString())
                .order('created_at', { ascending: true });

            if (data) {
                setMessages(data.map((msg: any) => ({
                    id: msg.id,
                    text: msg.text,
                    sender: msg.sender,
                    timestamp: new Date(msg.created_at),
                    isMe: msg.sender === userInfo.name
                })));
            }
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new;
                setMessages((prev) => {
                    // 1. Check if we already have this exact message ID (deduplication)
                    if (prev.some(m => m.id === newMsg.id)) return prev;

                    // 2. If it's from me, check if we have a pending optimistic message
                    // We look for a message from me, with the same text, and a temporary ID
                    if (newMsg.sender === userInfo.name) {
                        const pendingIndex = prev.findIndex(m =>
                            m.isMe &&
                            m.text === newMsg.text &&
                            m.id.startsWith('temp-')
                        );

                        if (pendingIndex !== -1) {
                            // Found the pending message! Update it with the real ID and timestamp
                            const newMessages = [...prev];
                            newMessages[pendingIndex] = {
                                ...newMessages[pendingIndex],
                                id: newMsg.id,
                                timestamp: new Date(newMsg.created_at)
                            };
                            return newMessages;
                        }
                    }

                    // 3. Otherwise, it's a new message (from someone else or missed optimistic update)
                    return [...prev, {
                        id: newMsg.id,
                        text: newMsg.text,
                        sender: newMsg.sender,
                        timestamp: new Date(newMsg.created_at),
                        isMe: newMsg.sender === userInfo.name
                    }];
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userInfo]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim() && emailInput.trim()) {
            const user = { name: nameInput, email: emailInput };
            setUserInfo(user);
            localStorage.setItem('chat_user_info', JSON.stringify(user));
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim() && userInfo) {
            const tempId = `temp-${Date.now()}`;
            const newMessage: Message = {
                id: tempId,
                text: inputText,
                sender: userInfo.name,
                timestamp: new Date(),
                isMe: true,
            };

            // Optimistic update
            setMessages((prev) => [...prev, newMessage]);
            setInputText('');

            // Insert into Supabase
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    text: newMessage.text,
                    sender: newMessage.sender,
                    // created_at is auto-generated
                })
                .select()
                .single();

            if (error) {
                console.error('Error sending message:', error);
                // Rollback if error
                setMessages((prev) => prev.filter(m => m.id !== tempId));
                alert('Failed to send message. Please try again.');
            } else if (data) {
                // Update the temp ID with the real ID from Supabase
                // Note: The subscription might have already done this, which is fine.
                setMessages((prev) => prev.map(m =>
                    m.id === tempId ? { ...m, id: data.id.toString() } : m
                ));
            }
        }
    };

    if (!userInfo) {
        return (
            <div className="w-full max-w-md mx-auto glass-card p-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join the Conversation</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Connect with other surgeons and professionals in the collaborative.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Dr. Jane Smith"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="jane.smith@hospital.edu"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                    >
                        Start Chatting
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] glass-card overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {userInfo.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{userInfo.name}</h3>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Surgery Grand Rounds Collaborative
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white/30 dark:bg-gray-900/30">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.isMe
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 px-1">
                            {msg.isMe ? 'You' : msg.sender} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
