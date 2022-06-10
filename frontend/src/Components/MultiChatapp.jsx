import React, { useEffect, useState, useRef } from 'react'
import './Chatapp.css';
import io from 'socket.io-client';


/******************************* Server-Side *****************************/

const serverUrl = "http://localhost:5000";
const socket = io(serverUrl);

/*************************************************************************/

const MultiChatapp = () => {

    const InRef = useRef();
    const MsgRef = useRef();
    const [messages, setMessages] = useState([]); 
    const [users, setUsers] = useState([]); // list of online clients
    const [userID, setUserID] = useState(''); // who i chat with

    const HandlSubmit = (e) =>{
        e.preventDefault();
        if (userID) {
            socket.emit('Chatting with specific user', userID, socket.id, InRef.current.value);
            InRef.current.value = ''; 
        }
    }

    useEffect(() =>{
        socket.on('Users Chat List', (clientIds) => {
            const clietsWithoutMe = clientIds.filter(client => client !== socket.id);
            setUsers(clietsWithoutMe);
        })
        socket.on('Connect with a specific user', (socketId) => {
            setUserID(socketId);
        });
        socket.on('Chatting with specific user message', function(msg) {
            setMessages((prev) => [...prev, msg]);
        });
        socket.on('Broadcast Chatting message', function(msg) {
            setMessages((prev) => [...prev, msg])
        });
        socket.on('Users Broadcast Chatting', function(msg) {
            setUsers((prev) => [...prev, msg]);
        });
        
    }, [])

    const handleClickClient = (userID) =>{
        setUserID(userID);
        socket.emit('Connect with a specific user', userID, socket.id);
    }



    return (
        <div className="container">
                    <aside >
                        <ul ref={MsgRef} id="users">
                            {
                                users.map((client,idx) => <li key={Math.ceil(Math.random() * 10000)}>User {idx+1}: <button onClick={()=>handleClickClient(client)}>{client}</button></li>)
                            }
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

export default MultiChatapp