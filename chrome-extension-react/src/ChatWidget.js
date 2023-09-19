import React, { useState } from "react";
import axios from 'axios';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = async () => {
        const userMessage = { message: newMessage, sender: 'You' };
        
        const response = await axios.post('http://34.121.174.78:5000/test/', {
            text: newMessage,
        });
      
        const botMessage = { message: response.data.text, sender: 'Bot' };

        setNewMessage("");
        setMessages([...messages, userMessage, botMessage]);
    };

  
    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle Chat</button>
        {isOpen && (
            <div style={{ border: '1px solid black', padding: '10px' }}>
            <MainContainer>
                <ChatContainer>
                <MessageList>
                    {messages.map((m, index) => (
                    <Message
                        key={index}
                        model={{
                        message: m.message,
                        sentTime: 'just now',
                        sender: m.sender,
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
                />
                </ChatContainer>
            </MainContainer>
            </div>
        )}
        </div>
    );
};

export default ChatWidget;
