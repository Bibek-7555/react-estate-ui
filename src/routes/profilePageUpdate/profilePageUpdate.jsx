import { useContext, useState, useRef } from 'react'
import './profilePageUpdate.scss'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import apiRequest from '../../lib/apiRequest'

function ProfilePageUpdate(){

    const {currentUser, updateUser} = useContext(AuthContext)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input click
    };

    let avatar

    const handleFileChange = (event) => {
        avatar = event.target.files[0]; // Get the selected file
        console.log('Selected file:', file); // For debugging, log the selected file
        // Add your file upload logic here
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        const formdata = new FormData(e.target)
        const { username, email, password } = Object.fromEntries(formdata);
        console.log("hello world")

        try {
            console.log("hello")
            console.log(currentUser)
            const res = await apiRequest.put(`/user/${currentUser.data._id}`, {username, email, password, avatar }, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            console.log("currentUser: ", currentUser)
            updateUser( res.data )
        } catch (error) {
            console.log(error)
            setError(error.response.data.message)
         }  finally {
            navigate("/profile")
            setLoading(false)
         }
       
    }
  return (
    <div className='profilePageUpdate'>
        <div className="formContainer">
            <form onSubmit={handleSubmit}>
                <h2>Update your Profile</h2>
                <input type="text" placeholder='New Username' name='username' minLength={4} maxLength={15} defaultValue={currentUser?.data?.username} required />
                <input type="text" placeholder='New Email' name='email' defaultValue={currentUser?.data?.email} required />
                <input type="text" placeholder='Password' name='password' />
                {/* <label htmlFor="avatar">Upload avatar</label>
                <input type="file" name='avatar' id='avatar' /> */}
                <button disabled={isLoading} >Update</button>
                {error && <span>{error}</span>}
            </form>
        </div>
        <div className="imageContainer">
            <img src={currentUser?.data?.avatar || "/noavatar.jpg" } alt="" />
            <div className='uploadFile'>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the file input
                onChange={handleFileChange} // Handle file selection
            />
            {/* Custom button to trigger file input */}
            <button onClick={handleButtonClick}>Upload Avatar</button>
        </div>
        </div>
    </div>
  )
}

export default ProfilePageUpdate