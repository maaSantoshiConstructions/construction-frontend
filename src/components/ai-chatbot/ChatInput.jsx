import React, { useRef, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';

export default function ChatInput({
  input = '',
  setInput,
  handleSend,
  loading = false
}) {
  const textareaRef = useRef(null);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  return (
    <div className="p-3.5 md:p-4 border-t border-slate-200 bg-white flex flex-col gap-2">
      <div className="flex items-end gap-2.5">
        <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 flex items-center border border-transparent focus-within:border-teal-500 focus-within:bg-white transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
            className="w-full bg-transparent border-none outline-none text-slate-800 text-sm placeholder-slate-400 resize-none max-h-24 leading-snug font-sans"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="w-11 h-11 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white rounded-full flex items-center justify-center border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all shadow-md flex-shrink-0"
        >
          <LuSend size={18} className="translate-x-[1px]" />
        </button>
      </div>
      <p className="text-[11px] text-center text-slate-400 font-medium">
        Type <strong className="text-slate-600">"restart"</strong> anytime to start fresh • Odisha Property Matcher
      </p>
    </div>
  );
}
