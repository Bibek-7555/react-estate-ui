import { useState } from "react"
import "./navbar.scss"

function Navbar(){
    const [openMenu,setOpenmenu] = useState(false)
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
            <a href="/" className="loginclass">Login</a>
            <a href="/" className="register">Signup</a>
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