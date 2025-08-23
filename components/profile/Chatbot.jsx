"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Palette, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "1",
            content:
                "Hello! I'm Colora, your AI creative assistant. I'm here to help you with your artistic journey. Whether you need inspiration, technique advice, or creative problem-solving, just ask!",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            content: inputValue,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue("");

        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage = {
            id: aiMessageId,
            content: "",
            isUser: false,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: currentInput }),
            });

            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === aiMessageId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === aiMessageId
                        ? {
                              ...msg,
                              content:
                                  "I'm sorry, I couldn't connect. Try again later.",
                          }
                        : msg
                )
            );
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Open Colora AI Assistant</span>
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:justify-end p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <Card className="relative w-full max-w-xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
                        <CardHeader className="flex  gap-3  pb-4 px-4 justify-between rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-secondary">
                                    <AvatarFallback className="bg-transparent text-white">
                                        <Palette className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-center">
                                    <CardTitle className="text-lg font-semibold leading-none">
                                        Colora
                                    </CardTitle>
                                    <div className="text-sm text-muted-foreground">
                                        Your AI creative companion
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 rounded-full hover:bg-muted self-start sm:self-auto"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close chat</span>
                            </Button>
                        </CardHeader>

                        <CardContent className="flex-1 p-0 min-h-0">
                            <ScrollArea className="h-full px-4 py-2">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.isUser
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-2 break-words ${
                                                    message.isUser
                                                        ? "bg-primary text-primary-foreground ml-4"
                                                        : "bg-muted text-muted-foreground mr-4"
                                                }`}
                                            >
                                                <div className="text-sm leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[
                                                            remarkGfm,
                                                        ]}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <p className="text-xs opacity-70 mt-1 text-right">
                                                    {message.timestamp.toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-2 mr-4">
                                                <div className="flex items-center space-x-1">
                                                    <Sparkles className="h-3 w-3 animate-pulse" />
                                                    <span className="text-sm">
                                                        Thinking...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </ScrollArea>
                        </CardContent>

                        <div className="p-4 sm:p-4 border-t bg-card flex-shrink-0">
                            <div className="flex  gap-2">
                                <Input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me about colors, techniques, inspiration..."
                                    className="flex-1 border-2 focus:border-primary transition-colors"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isTyping}
                                    size="icon"
                                    className=" shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">
                                        Send message
                                    </span>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                                Press Enter to send • Shift+Enter for new line
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
