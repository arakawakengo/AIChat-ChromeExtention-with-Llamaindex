import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Avatar,
    ConversationHeader,
    TypingIndicator,
    Button
} from "@chatscope/chat-ui-kit-react";

const ChatWidget = ({ articleKeywords = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [buttonTexts, setButtonTexts] = useState([]);

    const denshibaIcon = "https://sdl-stickershop.line.naver.jp/products/0/0/1/1101563/android/stickers/4159670.png";

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const sendMessage = async () => {
        if (!newMessage) return;
        if (isLoading) return;
        const userMessage = { message: newMessage, sender: 'You', sentTime: getCurrentTime() };

        setNewMessage("");
        setIsLoading(true);

        setMessages([...messages, userMessage]);
        
        const response = await axios.post('https://us-central1-nk-intern.cloudfunctions.net/llama2-api', {
            text: newMessage,
        });
      
        const botMessage = { message: response.data.text, sender: 'Bot', sentTime: getCurrentTime() };

        setIsLoading(false);
        setMessages([...messages, userMessage, botMessage]);
    };
    

    const getDirection = (sender) => {
        return sender === 'You' ? 'outgoing' : 'incoming';
    };



    useEffect(() => {
        chrome.runtime.onMessage.addListener((request) => {
          if (request.action === "ask_question") {
            console.log(request)
            console.log(request.question)
            setIsOpen(true);
            setNewMessage(request.question);
          }
        });
    }, []);

    useEffect(() => {
        chrome.runtime.onMessage.addListener((request) => {
            if (request.action === "send_keywords") {
              console.log(request)
              console.log(request.data)
            }
          });
    }, [articleKeywords]);
  
    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px'}}>
            <button onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: isOpen ? '3px 10px'  :'10px 20px', borderRadius:'12px', cursor: 'pointer', marginBottom: isOpen ? '3px': '10px' }}>{isOpen ? 'チャットを閉じる' : '記事について質問する'}</button>
            {isOpen && (
                <div style={{ border: '0.7px solid black', padding: '0px', width: "30vw", height: "70vh", minWidth: "300px", minHeight: "400px", borderRadius: "5px", overflow: "hidden" }}>
                    <ChatContainer>
                        <ConversationHeader>
                            <Avatar src={denshibaIcon} name="デンシバ" />
                            <ConversationHeader.Content userName="デンシバ" info="記事についてわからないことを聞いてほしいワン！" />       
                        </ConversationHeader>
                        <MessageList typingIndicator = { isLoading && <TypingIndicator content="考え中..." />}>
                            <div style={{ height: "45px", overflowX: 'auto', whiteSpace: 'nowrap',
                            '&::-webkit-scrollbar': {
                                width: '5px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '2.5px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                            } }}>
                                {buttonTexts.map((text, index) => (
                                    <Button key={index} border>{text}</Button>
                                ))}
                            </div>
                            {messages.map((m, index) => (
                            <Message
                                key={index}
                                model={{
                                message: m.message,
                                sentTime: m.sentTime,
                                sender: m.sender,
                                direction: getDirection(m.sender),
                                position: 'single'
                                }}
                            />
                            ))}
                        </MessageList>
                        <MessageInput 
                            placeholder="Type message here" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e)}
                            onSend={() => sendMessage()}
                            attachButton={false} 
                            sendDisabled={isLoading}
                        />
                    </ChatContainer>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
