import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, getToken } from "../api/client";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! Main MarketLink AI assistant hoon. Aap English ya Roman English mein products, markets aur pickup ke bare mein pooch sakte hain." }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    const previous = messages;
    setMessages((current) => [...current, { from: "user", text }]);
    setInput("");
    if (!getToken()) {
      setMessages((current) => [...current, { from: "bot", text: "AI assistant use karne ke liye pehle login karein." }]);
      return;
    }
    setSending(true);
    try {
      const history = previous.slice(-8).map((message) => ({
        role: message.from === "user" ? "user" : "assistant",
        content: message.text,
      }));
      const response = await api.post("/ai/chat", { message: text, history });
      setMessages((current) => [...current, { from: "bot", text: response.data.answer }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "bot", text: error.message || "AI assistant abhi available nahi hai. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  return <>
    <button className="ai-fab" onClick={() => setOpen(!open)} aria-label="MarketLink AI assistant">{open ? <X/> : <MessageCircle/>}</button>
    <AnimatePresence>
      {open && <motion.div className="ai-chat" initial={{ opacity: 0, y: 25, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 25 }}>
        <div className="ai-head"><span><Bot/> MarketLink AI</span><button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={17}/></button></div>
        <div className="ai-messages" aria-live="polite">
          {messages.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.text}</div>)}
          {sending && <div className="bubble bot">Thinking…</div>}
        </div>
        <div className="ai-input">
          <input aria-label="Ask MarketLink AI" value={input} disabled={sending} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Ask in English or Roman English..." />
          <button onClick={send} disabled={sending || !input.trim()} aria-label="Send message"><Send size={17}/></button>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}