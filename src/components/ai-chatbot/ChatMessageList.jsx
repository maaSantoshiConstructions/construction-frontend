import React, { useRef, useEffect } from 'react';
import { LuMapPin, LuPlane, LuGraduationCap, LuShoppingBag, LuExternalLink, LuBuilding2 } from 'react-icons/lu';

function PropertyCard({ prop }) {
  if (!prop) return null;

  return (
    <div className="mt-3 p-4 bg-white border border-teal-200/80 rounded-2xl shadow-sm text-slate-800 space-y-3">
      <h4 className="text-base font-bold text-teal-800 flex items-center gap-1.5">
        <span>🏠</span> {prop.name}
      </h4>
      
      <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
        <LuMapPin className="text-teal-600 flex-shrink-0" />
        <span>{prop.location} <strong className="text-slate-700">({prop.district})</strong></span>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {prop.bhks?.map((bhk, idx) => (
          <span
            key={idx}
            className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
          >
            {bhk}
          </span>
        ))}
      </div>

      <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-start gap-2">
          <LuBuilding2 className="text-slate-400 mt-0.5 flex-shrink-0 text-sm" />
          <div><strong className="text-slate-700">Railway:</strong> {prop.railway}</div>
        </div>
        <div className="flex items-start gap-2">
          <LuPlane className="text-slate-400 mt-0.5 flex-shrink-0 text-sm" />
          <div><strong className="text-slate-700">Airport:</strong> {prop.airport}</div>
        </div>
        <div className="flex items-start gap-2">
          <LuGraduationCap className="text-slate-400 mt-0.5 flex-shrink-0 text-sm" />
          <div><strong className="text-slate-700">Schools:</strong> {prop.schools}</div>
        </div>
        <div className="flex items-start gap-2">
          <LuShoppingBag className="text-slate-400 mt-0.5 flex-shrink-0 text-sm" />
          <div><strong className="text-slate-700">Markets:</strong> {prop.markets}</div>
        </div>
      </div>

      {prop.maps && (
        <a
          href={prop.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full mt-2 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
        >
          <LuMapPin size={14} />
          <span>Open in Google Maps</span>
          <LuExternalLink size={12} className="ml-0.5 opacity-80" />
        </a>
      )}
    </div>
  );
}

export default function ChatMessageList({
  messages = [],
  loading = false,
  onQuickReply
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 flex flex-col gap-4 scroll-smooth"
    >
      {/* Welcome Banner */}
      <div className="text-center text-xs font-semibold text-slate-500 pb-2">
        Secure chat • Real Odisha locations • Premium Projects
      </div>

      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={i}
            className={`flex flex-col max-w-[88%] md:max-w-[80%] ${
              isUser ? 'self-end items-end' : 'self-start items-start'
            } animate-fadeIn`}
          >
            {/* Bubble */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                isUser
                  ? 'bg-teal-700 text-white rounded-br-sm shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.html ? (
                <div
                  className="text-slate-800 leading-relaxed [&_strong]:font-bold [&_strong]:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ) : (
                <span className="text-slate-800 font-medium">{msg.content}</span>
              )}

              {/* Render property card if attached */}
              {msg.propertyCard && <PropertyCard prop={msg.propertyCard} />}
            </div>

            {/* Time */}
            {msg.time && (
              <span className="text-[10px] text-slate-400 px-1 mt-1 font-medium">
                {msg.time}
              </span>
            )}

            {/* Quick replies for this message step */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {msg.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuickReply && onQuickReply(qr)}
                    className="px-3.5 py-1.5 bg-white border-2 border-teal-700 text-teal-800 hover:bg-teal-700 hover:text-white active:scale-95 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Typing Indicator */}
      {loading && (
        <div className="self-start bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.32s]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.16s]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
        </div>
      )}
    </div>
  );
}
