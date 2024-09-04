import { useState } from "react"
import "./navbar.scss"
import { Link } from "react-router-dom"
import React, {useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore.js";

function Navbar(){
    const [openMenu,setOpenmenu] = useState(false);
    const {currentUser} = useContext(AuthContext)

    const fetch = useNotificationStore(state => state.fetch)
    const number = useNotificationStore(state => state.number)
    if(currentUser) {
        fetch()
    }
    return(
        <nav>
        <div className="left">
            <a href="/" className="logo">
                <img className="imgclass" src='./logo.png' alt="" />
                <span>BSTATE</span>
            </a>
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Others</a>
        </div>
        <div className="right">
           {currentUser ? (
           <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="hello" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
                {number > 0 && <div className="notification">{number}</div>}
                <span>Profile</span>
            </Link>
           </div>
           ) : (
            <>
                <a href="/login" className="loginclass">Login</a>
                <a href="/register" className="register">Signup</a>
            </>
            )}
            <div className="menuIcon">
                <img src="./menu.png" alt="" onClick={()=> setOpenmenu(!openMenu)} />
            </div>
            <div className={openMenu ? "menu open" : "menu"}>
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Others</a>
            <a href="/" >Login</a>
            <a href="/">Signup</a>
            </div>
        </div>
        </nav>
    )
}
export default Navbar