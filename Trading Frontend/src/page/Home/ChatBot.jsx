// components/ChatBot.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Bot } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendChatMessage,
  clearChatResponse,
  clearChatError,
} from "../../State/chatbot/Action";

const ChatBot = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chatbot || {});

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your crypto assistant. Ask me about any cryptocurrency!",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newUserMessage = { id: Date.now(), text: inputText, isBot: false };
    setMessages((prev) => [...prev, newUserMessage]);

    dispatch(sendChatMessage(inputText));
    setInputText("");
  };

  // update typing state
  useEffect(() => {
    setIsTyping(chat.loading || false);
  }, [chat.loading]);

  // handle backend response
  useEffect(() => {
    if (chat.response) {
      let botResponse;
      const responseData = chat.response;

      if (responseData.type === "coin") {
        const coin = responseData.data;
        const coinMessage = `💰 ${coin.name} (${coin.symbol?.toUpperCase()}) is currently trading at $${coin.currentPrice}\n` +
                          `📊 Market Cap Rank: #${coin.marketCapRank}\n` +
                          `📈 24h Change: ${coin.priceChangePercentage24h?.toFixed(2)}%\n` +
                          `💵 Market Cap: $${coin.marketCap?.toLocaleString()}\n` +
                          `📊 Volume (24h): $${coin.totalVolume?.toLocaleString()}`;

        botResponse = {
          id: Date.now() + 1,
          text: coinMessage,
          isBot: true,
        };
      } else {
        // Handle text responses
        let responseText = responseData.message || "🤔 Sorry, I didn't understand that.";
        
        // Format markdown-like text (convert **text** to bold)
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        botResponse = {
          id: Date.now() + 1,
          text: responseText,
          isBot: true,
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      dispatch(clearChatResponse());
    }
  }, [chat.response, dispatch]);

  // handle backend error
  useEffect(() => {
    if (chat.error) {
      const errorResponse = {
        id: Date.now() + 1,
        text: `❌ Error: ${chat.error}`,
        isBot: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
      dispatch(clearChatError());
    }
  }, [chat.error, dispatch]);

  // enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // auto-scroll
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // reset chat when closed
  useEffect(() => {
    if (!isOpen) {
      setMessages([
        {
          id: 1,
          text: "👋 Hello! I'm your crypto assistant. Ask me about any cryptocurrency!",
          isBot: true,
        },
      ]);
      setInputText("");
      dispatch(clearChatResponse());
      dispatch(clearChatError());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-800/50 overflow-hidden flex flex-col">
      {/* header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">Crypto Assistant</h3>
            <p className="text-xs opacity-80">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* messages */}
      <div
        id="chat-messages"
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-gradient-to-b from-orange-50/30 to-yellow-50/20 dark:from-gray-700/50 dark:to-gray-800/50"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isBot ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl ${
                message.isBot
                  ? "bg-orange-100 dark:bg-orange-900/30 text-gray-800 dark:text-gray-200 rounded-tl-none"
                  : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-tr-none"
              }`}
            >
              {/* Render message text with basic formatting */}
              <div className="whitespace-pre-line">
                {message.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">
                    {line.includes('<strong>') ? (
                      <span dangerouslySetInnerHTML={{ __html: line }} />
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-orange-100 dark:bg-orange-900/30 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none p-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <div className="p-3 border-t border-orange-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crypto prices..."
            className="flex-1 bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputText.trim() === "" || isTyping}
            size="icon"
            className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;