import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatHeader from '../../components/ai-chatbot/ChatHeader';
import ChatWindowHeader from '../../components/ai-chatbot/ChatWindowHeader';
import ChatMessageList from '../../components/ai-chatbot/ChatMessageList';
import ChatInput from '../../components/ai-chatbot/ChatInput';
import { properties, findNearestProperty, matchBHK } from '../../data/odishaProperties';
import { sendChatMessage } from '../../api/chatbot';

export default function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatState, setChatState] = useState({
    step: 'location', // location -> bhk -> budget -> done
    location: null,
    bhk: null,
    budget: null,
    suggestedProperty: null,
  });

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Initial bot greeting
  useEffect(() => {
    const initialMsg = {
      role: 'bot',
      content:
        'Namaste! 🙏<br><br>Welcome to <strong>Maa Santoshi Construction AI Assistant</strong>.<br><br>I help you find the perfect apartment from our premium projects across Odisha.<br><br>Which <strong>location or district</strong> are you interested in?',
      html: true,
      time: getTime(),
      quickReplies: ['Cuttack', 'Puri', 'Bhubaneswar', 'Sambalpur', 'Paradeep', 'Jajpur', 'Khordha'],
    };
    setMessages([initialMsg]);
  }, []);

  const addMessage = (msgObj) => {
    setMessages((prev) => [...prev, { ...msgObj, time: msgObj.time || getTime() }]);
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');
    addMessage({ role: 'user', content: text });
    setLoading(true);

    setTimeout(() => {
      processUserInput(text);
    }, 600 + Math.random() * 500);
  };

  const processUserInput = async (text) => {
    const lower = text.toLowerCase().trim();

    // Global Reset / Restart Command
    if (lower.includes('restart') || lower.includes('start over') || lower.includes('reset')) {
      setChatState({
        step: 'location',
        location: null,
        bhk: null,
        budget: null,
        suggestedProperty: null,
      });
      setLoading(false);
      addMessage({
        role: 'bot',
        content:
          "No problem! Let's start fresh. 😊<br><br>Which location or district in Odisha are you looking for an apartment?",
        html: true,
        quickReplies: ['Cuttack', 'Puri', 'Bhubaneswar', 'Sambalpur', 'Paradeep', 'Jajpur', 'Khordha'],
      });
      return;
    }

    // Step 1: Location Step
    if (chatState.step === 'location' || chatState.step === 'greeting') {
      const result = findNearestProperty(text);
      const newSuggested = result.prop;

      let locationReply = '';
      if (result.fallback) {
        locationReply = `I couldn't find an exact match for "<strong>${text}</strong>".<br><br>Our properties are currently available in selected prime locations across Odisha. Let me suggest the nearest option for you:`;
      } else if (!result.isExact) {
        locationReply = `Our property is <strong>not ready yet</strong> in the exact area you mentioned.<br><br>However, I can suggest the <strong>nearest available project</strong> from our portfolio:`;
      } else {
        locationReply = `Great choice! We have a project near <strong>${text}</strong>.`;
      }

      addMessage({
        role: 'bot',
        content: locationReply,
        html: true,
      });

      setTimeout(() => {
        addMessage({
          role: 'bot',
          content: 'Please tell me your preferred <strong>BHK</strong> configuration.',
          html: true,
          quickReplies: newSuggested.bhks,
        });
        setChatState({
          ...chatState,
          step: 'bhk',
          location: text,
          suggestedProperty: newSuggested,
        });
        setLoading(false);
      }, 400);

      return;
    }

    // Step 2: BHK Step
    if (chatState.step === 'bhk') {
      const currentProp = chatState.suggestedProperty || properties.priyan_naina;
      const matched = matchBHK(text, currentProp.bhks);

      if (!matched) {
        setLoading(false);
        addMessage({
          role: 'bot',
          content: 'Please choose from the available options for this project:',
          html: true,
          quickReplies: currentProp.bhks,
        });
        return;
      }

      addMessage({
        role: 'bot',
        content: `Got it — <strong>${matched}</strong>.<br><br>What is your approximate <strong>budget range</strong>? (You can also skip this)`,
        html: true,
        quickReplies: ['Under ₹40 Lakh', '₹40–60 Lakh', '₹60–90 Lakh', 'Above ₹90 Lakh', 'Skip for now'],
      });

      setChatState({
        ...chatState,
        step: 'budget',
        bhk: matched,
      });
      setLoading(false);
      return;
    }

    // Step 3: Budget Step -> Show Recommendation Card
    if (chatState.step === 'budget') {
      const prop = chatState.suggestedProperty || properties.priyan_naina;

      const isExactMatch = findNearestProperty(chatState.location || '').isExact;
      const intro = isExactMatch
        ? `Perfect! Based on your preferences, here is my recommendation:`
        : `As requested, here is the <strong>nearest available property</strong> matching your requirements:`;

      addMessage({
        role: 'bot',
        content: intro,
        html: true,
      });

      setTimeout(() => {
        addMessage({
          role: 'bot',
          content: `Project Details for <strong>${prop.name}</strong>`,
          html: true,
          propertyCard: prop,
        });

        setTimeout(() => {
          addMessage({
            role: 'bot',
            content:
              'Would you like me to suggest another location, or shall I help you with anything else? (You can also type <strong>"restart"</strong> to begin again)',
            html: true,
            quickReplies: ['Show another location', 'Contact details', 'Restart chat'],
          });
          setChatState({ ...chatState, step: 'done', budget: text });
          setLoading(false);
        }, 500);
      }, 300);

      return;
    }

    // Step 4: Done Step / General queries
    if (chatState.step === 'done') {
      if (lower.includes('another') || lower.includes('different') || lower.includes('other')) {
        setChatState({
          step: 'location',
          location: null,
          bhk: null,
          budget: null,
          suggestedProperty: null,
        });
        setLoading(false);
        addMessage({
          role: 'bot',
          content: 'Sure! Which other location or district would you like to explore?',
          html: true,
          quickReplies: ['Cuttack', 'Puri', 'Bhubaneswar', 'Sambalpur', 'Paradeep', 'Jajpur'],
        });
        return;
      }

      if (lower.includes('contact') || lower.includes('call') || lower.includes('number') || lower.includes('sales')) {
        setLoading(false);
        addMessage({
          role: 'bot',
          content:
            'You can reach our sales team at:<br><br>📞 <strong>+91-9876543210</strong><br>📧 <strong>sales@maasantoshiconstructions.com</strong><br><br>Or simply continue chatting here for more details!',
          html: true,
          quickReplies: ['Restart chat', 'Show all projects'],
        });
        return;
      }

      if (lower.includes('all') || lower.includes('projects')) {
        setLoading(false);
        addMessage({
          role: 'bot',
          content: 'Here are all our 7 flagship Odisha projects:<br>• <strong>Priyan Naina Enclave</strong> (Cuttack)<br>• <strong>Priya Jostna</strong> (Bhubaneswar/Puri Road)<br>• <strong>Santoshi Enclave</strong> (Bari, Jajpur)<br>• <strong>Sea View Resort</strong> (Puri Sea Beach)<br>• <strong>Township Apartment</strong> (Sambalpur)<br>• <strong>Port Villa</strong> (Paradeep)<br>• <strong>Sun Rise Enclave</strong> (Khordha)',
          html: true,
          quickReplies: ['Cuttack', 'Puri', 'Bhubaneswar', 'Sambalpur', 'Paradeep', 'Jajpur', 'Khordha'],
        });
        return;
      }
    }

    // Try backend AI chatbot service if available
    try {
      const { data } = await sendChatMessage({ message: text });
      const botReply =
        data?.data?.botMessage?.content ||
        data?.data?.botResponse ||
        "I'm here to help! You can ask about any of our 7 projects, request a different location, or type <strong>restart</strong> to begin a new search.";

      addMessage({
        role: 'bot',
        content: botReply,
        html: true,
        quickReplies: ['Restart chat', 'Show all projects', 'Contact details'],
      });
    } catch {
      addMessage({
        role: 'bot',
        content:
          "I'm here to help! You can ask about any of our 7 projects, request a different location, or type <strong>restart</strong> to begin a new search.",
        html: true,
        quickReplies: ['Restart chat', 'Show all projects', 'Contact details'],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    handleSend(text);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Page Header */}
      <ChatHeader />

      {/* Main Chat Container */}
      <div className="flex-1 wrap w-full max-w-4xl mx-auto -mt-8 relative z-10 pb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[550px]"
        >
          {/* Chat Window Header */}
          <ChatWindowHeader />

          {/* Message List */}
          <ChatMessageList
            messages={messages}
            loading={loading}
            onQuickReply={handleQuickReply}
          />

          {/* Input Panel */}
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
}
