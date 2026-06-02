import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

const CopilotChat = ({ datasetId, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Power BI Copilot. I have analyzed your dataset. How can I help you build your dashboard today?' }
  ]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(`ws://127.0.0.1:8000/api/chat/session-${datasetId || 'new'}`);
    
    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, { role: 'assistant', content: event.data }]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [datasetId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    ws.current.send(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 w-[350px] shadow-2xl rounded-2xl overflow-hidden fixed bottom-6 right-6 z-50">
      <div className="p-4 border-b border-slate-200 bg-primary-500 text-slate-900 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold">
          <Bot className="h-5 w-5" /> Power BI Copilot
        </div>
        <button onClick={onClose} className="hover:bg-primary-600 p-1 rounded transition-colors text-slate-900">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-primary-100 border border-primary-200 text-primary-700'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
          />
          <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-slate-900 p-2 rounded-lg transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CopilotChat;
