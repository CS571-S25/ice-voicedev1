import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

import TextAppMessageList from './TextAppMessageList';
import Constants from '../constants/Constants';
import createChatAgent from '../agent/ChatAgent';

function TextApp() {

    const chatAgent = useMemo(() => createChatAgent(), []);

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    async function handleWelcome() {
        const msg = await chatAgent.handleInitialize();
        addMessage(Constants.Roles.Assistant, msg);
    }

    async function handleSend(e) {
        e?.preventDefault();
        const input = inputRef.current.value?.trim();
        if (input) {
            addMessage(Constants.Roles.User, input);
            inputRef.current.value = "";
            setIsLoading(true);
            const resp = await chatAgent.handleReceive(input);
            if(Array.isArray(resp)) {
                for(let msg of resp) { 
                    addMessage(Constants.Roles.Assistant, msg);
                }
            } else {
                addMessage(Constants.Roles.Assistant, resp);
            }
            setIsLoading(false);
        }
    };

    function addMessage(role, content) {
        setMessages(o => [...o, {
            role: role,
            content: content
        }]);
    }

    useEffect(() => {
        handleWelcome();
    }, []);

    return (
        <div className="app">
            <TextAppMessageList messages={messages}/>
            {isLoading ? <BeatLoader color="#36d7b7"/> : <></>}
            <div className="input-area">
                <Form className="inline-form" onSubmit={handleSend}>
                    <Form.Control
                        ref={inputRef}
                        style={{ marginRight: "0.5rem", display: "flex" }}
                        placeholder="Type a message..."
                        aria-label='Type and submit to send a message.'
                    />
                    <Button type='submit' disabled={isLoading}>Send</Button>
                </Form>
            </div>
        </div>
    );
}

export default TextApp;
