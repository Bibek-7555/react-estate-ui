import React, { useContext, useEffect, useRef, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import "./chatBox.scss"
import { AuthContext } from "../../context/AuthContext.jsx"
import { SocketContext } from "../../context/SocketContext.jsx"

function ChatBox({receiverId, closeChatBox}) {

    const[messages, setMessages] = useState([]);
    const[receiver, setReceiver] = useState(null);
    const handleClose = () => setShouldClose(false);
    const {currentUser} = useContext(AuthContext);
    const { socket } = useContext(SocketContext)
    const[chatRoom, setChatRoom] = useState(null);

    const messageEndRef = useRef()

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    useEffect(()=> {
        let isMounted = true;
            const initialize = async() => {
                if (isMounted) {
                console.log("The receiver ID is: ", receiverId);
                const getReceiver = await apiRequest.get("/user/" + receiverId);
                console.log(getReceiver.data);
                if(getReceiver) {
                    setReceiver(getReceiver.data.data);
                }
                const res = await apiRequest.get("/chatRooms/find/Chat", { params: { receiverId }});
                console.log("The response is : ", res);
                console.log("The response to this apiRequest.get(/chatRooms/find/Chat, receiverId is: ", res.data)
                if(res.data != null) {
                    setChatRoom(res.data._id);
                    console.log("messages found: ", res.data)
                    setMessages(res.data.messages)
                    } else {
                        console.log("In else condition")
                        const cretaeRes = await apiRequest.post("/chatRooms", {receiverId});
                        console.log("The new created chatroom is :",cretaeRes.data);
                        setChatRoom(cretaeRes.data._id);
                        setMessages(cretaeRes.data.messages)
                    }
                }
            }
        
     initialize();
     return () => {
        isMounted=false;
     };
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formdata = new FormData(e.target)
        const content = formdata.get('textMessage');
        try {
            const res = await apiRequest.post("/messages/" + chatRoom, {content})
            console.log("The message created is: ",res.data)
            console.log("After creating message: ", messages);
            if(res) {
                if(messages.length == 0) {
                    setMessages([res.data.data])
                } else {
                    setMessages([...messages, res.data.data])
                }
            }
            socket.emit("sendMessage", {
                receiverId: receiver._id,
                data: res.data.data
            })
            e.target.reset();
            console.log("Updated messages are: ", messages)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        console.log("testing from useEfect read")
        const read = async() => {
            try {
                console.log("Going to make it read")
                const isRead = await apiRequest.put("/chatRooms/read/" + chatRoom)
                console.log(isRead.data)
            } catch (error) {
                console.log(error)
            }
        }
        if(messages && socket) {
            read()
            socket.on("getMessage", (data)=> {
                if(chatRoom === data.chatRoom) {
                    setMessages([...messages, data])
                    
                }
            })
        }
        return () => {
            socket.off("getMessage")
        }
    }, [socket, messages])

    return (
        <div className='mainBox'>
            <div className='navbar'>
                <div className='information'>
                    <img src={receiver?.avatar} alt="" />
                    <span>{receiver?.username}</span>
                </div>
                <button onClick={closeChatBox}>X</button>
            </div>
            <div className='chats'>
                {Array.isArray(messages) && messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message._id}
                     className='message'
                     style={{
                        alignSelf: message.sender === currentUser._id ? 'flex-end' : 'flex-start',
                        textAlign: message.sender === currentUser._id ? 'right' : 'left',
                        backgroundColor: message.sender === currentUser._id ? 'green': 'grey'
                        // color: message.sender === currentUser._id ? 'orange' : 'pink'
                    }}
                     >{message.content}</div>
                ))
                ) : (
                <div>No messages</div>
                )}
                <div ref={messageEndRef}></div>
            </div>
            <div className='bottom'>
                <form onSubmit={handleSubmit}>
                <textarea name="textMessage" id=""></textarea>
                <button>Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;