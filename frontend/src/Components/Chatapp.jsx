import React, { useEffect, useState, useRef } from 'react'
import './Chatapp.css';
import io from 'socket.io-client';

/******************************* Server-Side *****************************/

const serverUrl = "http://localhost:5000";
const socket = io(serverUrl);

const Chatapp = () => {

    const InRef = useRef();
    const MsgRef = useRef();
    const [messages, setMessages] = useState([]);

    const HandlSubmit = (e) =>{
        e.preventDefault();
        if (InRef.current.value) {
            socket.emit('Server Broadcast Chatting message', InRef.current.value);
            InRef.current.value = '';
        }
    }

    useEffect(() =>{
        socket.on('Broadcast Chatting message', function(msg) {
            setMessages((prev) => [...prev, msg])
        });
    }, [])

    return (
                <div className="container">
                <aside >
                    <ul ref={MsgRef} id="messages">
                        <h2>Chatting Room</h2>
                    </ul>
                </aside>
                <section >
                    <ul ref={MsgRef} id="messages">
                        {
                            messages.map((message) => <li key={Math.ceil(Math.random() * 10000)}>{message}</li>)
                        }
                    </ul>
                    <form id="form" onSubmit={HandlSubmit}>
                        <input 
                            placeholder="Enter your message" 
                            id="input" 
                            ref={InRef} 
                            required
                        />
                        <button>Send</button>
                    </form>
                </section>
            </div>
    )
}

export default Chatapp;