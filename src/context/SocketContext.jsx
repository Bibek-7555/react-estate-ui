import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'
import { AuthContext } from "./AuthContext.jsx";

export const SocketContext = createContext();


export const SocketContextProvider = ({children}) => {

    const { currentUser } = useContext(AuthContext)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("https://socket-lsof.onrender.com"))
    }, [])

    useEffect(() => {
        currentUser && socket?.emit("newUser", currentUser._id)
    }, [currentUser, socket])

    return (
        <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
    )
}