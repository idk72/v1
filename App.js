
import React, { useState } from "react";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newChat = { role: "user", content: input };
    setChatHistory([...chatHistory, newChat]);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      const [htmlCode, cssCode, jsCode] = parseCode(data.content);
      setHtml(htmlCode);
      setCss(cssCode);
      setJs(jsCode);
      setChatHistory([...chatHistory, newChat, { role: "bot", content: data.content }]);
    } catch (error) {
      console.error("Error generating code:", error);
    }
    setLoading(false);
    setInput("");
  };

  const parseCode = (code) => {
    const htmlMatch = code.match(/<html>([\s\S]*?)<\/html>/i);
    const cssMatch = code.match(/<style>([\s\S]*?)<\/style>/i);
    const jsMatch = code.match(/<script>([\s\S]*?)<\/script>/i);
    return [
      htmlMatch ? htmlMatch[1] : "",
      cssMatch ? cssMatch[1] : "",
      jsMatch ? jsMatch[1] : "",
    ];
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-md ${
                chat.role === "user" ? "bg-blue-600" : "bg-gray-700"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {chat.content}
            </motion.div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="mt-2 w-full bg-blue-600 p-2 rounded-md hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="flex-1 border-b border-gray-700">
          <iframe
            className="w-full h-full"
            srcDoc={`<style>${css}</style>${html}<script>${js}</script>`}
            sandbox="allow-scripts"
            title="Live Preview"
          />
        </div>
        <div className="p-4 flex space-x-4 bg-gray-800">
          <CodeMirror
            value={html}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme="dark"
            onChange={(value) => setHtml(value)}
          />
          <CodeMirror
            value={css}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme="dark"
            onChange={(value) => setCss(value)}
          />
          <CodeMirror
            value={js}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme="dark"
            onChange={(value) => setJs(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
            