import Chat from '../../components/chat/Chat'
import List from '../../components/list/List'
import './profilePage.scss'
import apiRequest from '../../lib/apiRequest'
import { Await, useLoaderData, useNavigate } from 'react-router-dom'
import { Suspense, useContext, useEffect, useState } from 'react'
import {AuthContext} from "../../context/AuthContext.jsx"
import { useRouteError } from 'react-router-dom';

function ProfilePage(){

  const {currentUser, updateUser} = useContext(AuthContext)
  const [error, setError] = useState("")
  const [isDisabled, setDisabled ] = useState(false)

  const navigate = useNavigate()

  const data = useLoaderData()
  console.log("data is: ",data)

  
  const handleLogout = async () => {
    setError("")
    setDisabled(true)
    try {
      const res = await apiRequest.post("/auth/logout")
      updateUser(null)
      navigate("/")
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message)
      updateUser(null)
      navigate("/login")
    } finally {
      setDisabled(false)
    }
  }
  return (
    (currentUser && <div className='profilePage'>
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button onClick={() => {navigate("/profile-update")}}>Update Profile</button>
          </div>
          <div className="info">
            <span>
              Avatar: 
              <img src={currentUser?.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>Username: <b>{currentUser?.username || "No username"}</b> </span>
            <span>Email: <b>{currentUser?.email || "No email"}</b> </span>
            {currentUser && <button disabled={isDisabled} onClick={handleLogout}>Logout</button>}
            {error && <span>{error}</span>}
          </div>
          <div className="title">
            <h1>My List</h1>
            <button onClick={() => navigate("/add-post")}>Add New Post</button>
          </div>
          <Suspense
            fallback={<p>Loading...</p>}
          >
            <Await
              resolve={data.postResponse}
              errorElement={<ErrorElement />}
              >
                {(postResponse) => (
                    <List items={postResponse.data.data.userPosts} />
                )}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense
            fallback={<p>Loading...</p>}
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error!</p>}
              >
                {(postResponse) => 
                  <List items={postResponse.data.data.savedPosts} />
                }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense
              fallback={<p>Loading...</p>}
            >
              <Await
                resolve={data.chatResponse}
                errorElement={<p>Error!</p>}
                >
                  {(chatResponse) => 
                    <Chat chats={chatResponse} />
                  }
              </Await>
            </Suspense>
        </div>
      </div>
    </div>
  ))
}

const ErrorElement = () => {
  const error = useRouteError();
  console.error("Error in Await:", error);
  
  return <p>Error loading posts!</p>;
};

export default ProfilePage