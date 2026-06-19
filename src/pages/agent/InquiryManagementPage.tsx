import { useState } from "react";
import { Search, Phone, Send } from "lucide-react";

/* ================= TYPES ================= */
type Sender = "customer" | "agent";

type Message = {
  sender: Sender;
  text: string;
};

type User = {
  name: string;
  email: string;
};

export default function InquiryManagementUI() {
  const [activeUser, setActiveUser] = useState<User>({
    name: "John Smith",
    email: "johnsmith@gmail.com",
  });

  const [messageInput, setMessageInput] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "customer",
      text: "Hi, I'm interested in the 3BHK apartment listing.",
    },
    {
      sender: "agent",
      text: "Sure! I'd be happy to help.",
    },
    {
      sender: "customer",
      text: "Can I schedule a property visit this weekend?",
    },
    {
      sender: "agent",
      text: "Absolutely. Saturday at 11 AM works well.",
    },
  ]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      sender: "agent",
      text: messageInput,
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentText = messageInput;
    setMessageInput("");

    setTimeout(() => {
      const autoReply: Message = {
        sender: "customer",
        text: getAutoReply(currentText),
      };

      setMessages((prev) => [...prev, autoReply]);
    }, 900);
  };

  /* ================= AUTO REPLY ================= */
  const getAutoReply = (text: string): string => {
    const msg = text.toLowerCase();

    if (msg.includes("price")) return "Sure, the price starts from ₹85 Lakhs.";
    if (msg.includes("visit")) return "Yes, I can schedule a visit for you.";
    if (msg.includes("location"))
      return "It is located in a prime area of the city.";
    if (msg.includes("bhk"))
      return "We have 1BHK, 2BHK, and 3BHK options.";

    return "Got it 👍 Our team will get back to you shortly.";
  };

  return (
    <div className="h-screen bg-slate-100 p-6">
      <div className="grid grid-cols-12 gap-6 h-full">

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="col-span-4">
          <div className="bg-white rounded-3xl shadow-lg h-full flex flex-col overflow-hidden">

            <div className="p-5 border-b">
              <h2 className="text-xl font-bold text-slate-800">
                Conversations
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Customer inquiries and active chats
              </p>

              <div className="relative mt-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  placeholder="Search conversation..."
                  className="w-full bg-slate-50 border rounded-xl py-3 pl-10 pr-4 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div
                className="p-4 bg-blue-50 border-b cursor-pointer"
                onClick={() =>
                  setActiveUser({
                    name: "John Smith",
                    email: "johnsmith@gmail.com",
                  })
                }
              >
                <h4 className="font-semibold text-slate-800">
                  John Smith
                </h4>
                <p className="text-sm text-slate-500">
                  johnsmith@gmail.com
                </p>
              </div>

              <div
                className="p-4 border-b cursor-pointer hover:bg-slate-50"
                onClick={() =>
                  setActiveUser({
                    name: "Sarah Wilson",
                    email: "sarah@gmail.com",
                  })
                }
              >
                <h4 className="font-semibold text-slate-800">
                  Sarah Wilson
                </h4>
                <p className="text-sm text-slate-500">
                  sarah@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CHAT WINDOW ================= */}
        <div className="col-span-8">
          <div className="bg-white rounded-3xl shadow-lg h-full flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {activeUser.name}
                </h3>

                <p className="text-sm text-slate-400">
                  Active conversation
                </p>
              </div>

              <button className="p-3 rounded-xl border hover:bg-slate-50">
                <Phone size={18} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "agent"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 max-w-md rounded-2xl text-sm ${
                      msg.sender === "agent"
                        ? "bg-blue-600 text-white"
                        : "bg-white border text-slate-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t p-5">
              <div className="flex gap-3">

                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 rounded-xl flex items-center gap-2 hover:bg-blue-700"
                >
                  <Send size={16} />
                  Send
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}