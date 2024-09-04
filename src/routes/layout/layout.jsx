import './layout.scss'
import Navbar from '../../components/Navbarfolder/Navbar'
import HomePage from '../../routes/homePage/homePage'
import { Outlet } from 'react-router-dom'

function Layout(){
  return (
    <div className='layout'>
       <div className="navbar">
       <Navbar />
       </div>
       <div className="content">
        <Outlet />
       </div>
     </div>
  )
}

export default Layout