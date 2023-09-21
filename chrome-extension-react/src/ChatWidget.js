import React, { useState } from "react";
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
} from "@chatscope/chat-ui-kit-react";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const denshibaIcon = "https://sdl-stickershop.line.naver.jp/products/0/0/1/1101563/android/stickers/4159670.png";

    const sendMessage = async () => {
        const userMessage = { message: newMessage, sender: 'You' };
        
        const response = await axios.post('https://us-central1-nk-intern.cloudfunctions.net/llama2-api', {
            text: newMessage,
        });
      
        const botMessage = { message: response.data.text, sender: 'Bot' };

        setNewMessage("");
        setMessages([...messages, userMessage, botMessage]);
    };

    const getDirection = (sender) => {
        return sender === 'You' ? 'outgoing' : 'incoming';
    };
  
    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', width: "300px" }}>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle Chat</button>
        {isOpen && (
            <div style={{ border: '1px solid black', padding: '10px', width: "100%", height: "500px" }}>
            <ChatContainer>
                <ConversationHeader>
                    <Avatar src={denshibaIcon} name="デンシバ" />
                    <ConversationHeader.Content userName="デンシバ" info="なんでも質問してね！" />       
                </ConversationHeader>
                <MessageList>
                    {messages.map((m, index) => (
                    <Message
                        key={index}
                        model={{
                        message: m.message,
                        sentTime: 'just now',
                        sender: m.sender,
                        direction: getDirection(m.sender)
                        }}
                    >
                    </Message>

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
            </div>
        )}
        </div>
    );
};

export default ChatWidget;
