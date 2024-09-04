import './homePage.scss'
import SearchBar from '../../components/SearchBar/searchBar'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


function HomePage(){

    // const {currentUser} = useContext(AuthContext)

    // console.log(currentUser)
  return (
    <div className='homePage'> 
        <div className="textContainer">
            <div className="wrapper">
                <h1 className='title'>Find Real Estate & Get Your Dream Place</h1>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit sed, impedit aut laudantium sapiente voluptatum, id nobis omnis facere dolorum praesentium vitae, mollitia veniam accusantium. Quos, sapiente. Similique reiciendis, dolorum architecto dolor quisquam beatae harum.
                </p>
                <SearchBar />
                <div className="boxes">
                    <div className="box">
                    <h1>16+</h1>
                    <h2>Years of Experience</h2>
                    </div>
                    <div className="box">       
                    <h1>200</h1>
                    <h2>Awards Gained</h2>
                    </div>
                    <div className="box">
                    <h1>1200+</h1>
                    <h2>Property Ready</h2>
                    </div>
                </div> 
            </div> 
        </div> 
        <div className="imgContainer">
            <img src="./bg.png" alt="" />
        </div>

    </div>
  )
}

export default HomePage;