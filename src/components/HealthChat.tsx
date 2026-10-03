import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Volume2,
  VolumeX,
  FileText,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { MedicalReportAnalysis, UserProfile } from '../types/medical.ts';
import { apiClient } from '../services/apiClient.ts';

interface HealthChatProps {
  currentReport: MedicalReportAnalysis | null;
  currentUser: UserProfile;
  currentLanguage: string;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  uncertaintyScore?: number;
}

const STARTER_PROMPTS = [
  'What lifestyle modifications lower high LDL and triglycerides most effectively?',
  'How does an elevated hs-CRP score relate to daily stress or diet?',
  'What should I prioritize asking my doctor during our 15-minute consultation?',
  'Can physical therapy reverse or heal a lumbar disc protrusion?',
];

export const HealthChat: React.FC<HealthChatProps> = ({ currentReport, currentUser, currentLanguage }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init_msg',
      sender: 'assistant',
      content: `Hello ${currentUser.name}! I am HEALGEN, your Responsible AI Healthcare Companion. I help you understand your medical reports, decode complex terms, and prepare questions for your doctor.\n\nHow can I help you understand your health information today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      uncertaintyScore: 95,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isSending) return;

    const userMsg: MessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.sender,
        content: m.content,
      }));

      const contextText = currentReport
        ? `Report Title: ${currentReport.title}\nReport Date: ${currentReport.reportDate}\nPlain Summary: ${currentReport.plainLanguageSummary}\nBiomarkers: ${JSON.stringify(
            currentReport.biomarkers.map((b) => `${b.name}: ${b.value} (${b.status})`)
          )}`
        : undefined;

      const response = await apiClient.chat({
        messages: chatHistory,
        reportContext: contextText,
        language: currentLanguage,
        userId: currentUser.id,
        userRole: currentUser.role,
      });

      const assistantMsg: MessageItem = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uncertaintyScore: response.uncertaintyIndex || 92,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          content: 'I apologize, but I encountered a momentary connection issue. Please feel free to try your question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleReadAloud = (id: string, text: string) => {
    if (activeSpeechId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);
      window.speechSynthesis.speak(utterance);
      setActiveSpeechId(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900">HEALGEN Health Q&A Assistant</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Non-Diagnostic
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentReport
                ? `Context: Connected to active report "${currentReport.title}"`
                : 'General medical terminology and preparation assistant'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>HIPAA Safe Harbor Scrubbing</span>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-80 border-t border-slate-200/40">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {msg.uncertaintyScore && <span>Confidence: {msg.uncertaintyScore}%</span>}
                        <button
                          onClick={() => handleReadAloud(msg.id, msg.content)}
                          className="hover:text-teal-700 flex items-center gap-0.5"
                          title="Read aloud"
                        >
                          {activeSpeechId === msg.id ? (
                            <VolumeX className="w-3 h-3 text-amber-600" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>HealGen Assistant is formulating a safe, plain-language explanation...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts Bar */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Suggestions:</span>
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question about your symptoms, medications, or lab terms..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputValue.trim()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
