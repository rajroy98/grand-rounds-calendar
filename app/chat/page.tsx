import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Calendar</span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Surgeon Connection
                    </h1>
                    <div className="w-24"></div> {/* Spacer for alignment */}
                </div>

                {/* Chat Interface */}
                <ChatInterface />
            </div>
        </main>
    );
}
