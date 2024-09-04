import { Socket } from 'socket.io-client'
import { AuthContext } from '../../context/AuthContext.jsx'
import apiRequest from '../../lib/apiRequest'
import './chat.scss'
import { useContext, useEffect, useRef, useState } from 'react'
import { format } from 'timeago.js'
import { SocketContext } from '../../context/SocketContext.jsx'
import { useNotificationStore } from '../../lib/notificationStore.js'

function Chat({chats}){

    console.log("chats are: ",chats)
    const [chat, setChat] = useState(null)
    const {currentUser} = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    console.log("currentuser is: ", currentUser)

    const messageEndRef = useRef()
    const decrease = useNotificationStore((state) => state.decrease)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [chat])

    const handleOpenChat = async(id, receiver) => {
        try {
            const res = await apiRequest("/chatRooms/"+ id);
            console.log("printing res.data.seenBy: ", res.data.seenBy)
            if(!res.data.seenBy.includes(currentUser._id)) {
                console.log("Going to decrease")
                decrease()
            }
            console.log("Res is: ", res.data)
            console.log("Habibi: ", {...res.data, receiver})
            setChat({...res.data, receiver})
            console.log("Setchat is: ", chat)
        } catch (error) {
            console.log("Error in handleopenchat: ",error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const content = formData.get('content')
        if(!content) {
            return
        }
        try {
            const res = await apiRequest.post("/messages/" + chat._id, {content})
            console.log("Before setchat is: ", chat)
            console.log("res after message is created is: ", res.data)
            const demo = {...chat, messages: [...chat.messages, res.data.data]}
            console.log("Demo is: ", demo)
            setChat(prev => ({...prev, messages:[...prev.messages, res.data.data]}))
            socket.emit("sendMessage", {
                receiverId: chat.receiver._id,
                data: res.data.data
            })
            e.target.reset()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        console.log("testing from useEfect read")
        const read = async() => {
            try {
                console.log("Going to make it read")
                const isRead = await apiRequest.put("/chatRooms/read/" + chat._id)
                console.log(isRead.data)
            } catch (error) {
                console.log(error)
            }
        }
        if(chat && socket) {
            read()
            socket.on("getMessage", (data)=> {
                if(chat._id === data.chatRoom) {
                    setChat(prev => ({...prev, messages: [...prev.messages, data]}))
                    
                }
            })
        }
        return () => {
            socket.off("getMessage")
        }
    }, [socket, chat])

  return (
    <div className='chat'>
        <div className="messages">
            <h1>Messages</h1>
            {
                chats.data.map((ch) => (
                    <div className="message" key={ch._id}
                        style={{backgroundColor: ch.seenBy.includes(currentUser._id) ? "white" : "#fecd514e"}}
                        onClick={() => handleOpenChat(ch._id, ch.receiver)}
                    >
                        <img src={ch.receiver.avatar || "/noavatar.jpg"} alt="" />
                        <span>{ch.receiver.username}</span>
                        <p>{ch.lastMessage.content}</p>
                    </div>
                ))
            }
            
        </div>
        { chat && 
        <div className="chatBox">
            <div className="top">
                <div className="user">
                    <img src={chat.receiver.avatar || '/noavatar.jpg'} alt="" />
                    {chat.receiver.username}
                </div>
                <span className="close" onClick={() => setChat(null)}>X</span>
            </div>
            <div className="center">
                {chat.messages.map((message) => (
                    <div className="chatMessage own" key={message._id}
                    style={{
                        alignSelf: message.sender === currentUser._id ? 'flex-end' : 'flex-start',
                        textAlign: message.sender === currentUser._id ? 'right' : 'left',
                        backgroundColor: message.sender === currentUser._id ? 'green': 'grey'
                        // color: message.sender === currentUser._id ? 'orange' : 'pink'
                    }}
                    >
                        <p>{message.content}</p>
                        <span>{format(message.createdAt)}</span>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
            <div className="bottom">
                <form onSubmit={handleSubmit}>
                <textarea name='content'></textarea>
                <button>Send</button>
                </form>
            </div>
        </div>}
    </div>
  )
}

export default Chat