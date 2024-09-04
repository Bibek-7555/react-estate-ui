import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { singlePostData, userData } from "../../lib/dummydata";
import { redirect, useLoaderData } from "react-router-dom";
import DomPurify from 'dompurify'
import { useContext, useEffect, useRef, useState } from "react";
import {AuthContext} from "../../context/AuthContext.jsx"
import apiRequest from "../../lib/apiRequest";
import ChatBox from "../../components/chatBox/chatBox.jsx"

function SinglePage() {

  const data = useLoaderData()
  const post = data?._doc
  console.log("The data is: ",data)
  console.log("The id is: ", data._doc.postOwner._id)
  const receiverID = data?._doc?.postOwner?._id;

  const [saved, setsaved] = useState(data.isSaved)
  const [error, setError] = useState("")
  const [isDisabled, setDisabled] = useState(false)
  const[chatBoxEnabled, setChatBoxEnabled] = useState(false);

  useEffect(() => {
    if(error) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  },[error])

  const {currentUser, updateUser} = useContext(AuthContext)

  const errorTimeoutRef = useRef()

  const handleSave = async () => {
    
    if(!currentUser) {
      redirect("/login")
    }
    try {
      const res = await apiRequest.post('/user/save', {postID: post._id})
      if(res) {
        setsaved((prev) => !prev)
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message)
    } finally {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Set new timeout
      errorTimeoutRef.current = setTimeout(() => {
        setError("");
        errorTimeoutRef.current = null;
      }, 2000);
    }
  }

  const openChatBox = () => setChatBoxEnabled(true);
  const closeChatBox = () => setChatBoxEnabled(false);
  
  return (
    <div className="singlePage">
      {chatBoxEnabled && <ChatBox receiverId={receiverID} closeChatBox={closeChatBox}/>}
      <div className="details">
        <div className="wrapper">
          <Slider images={post.postImages} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.postOwner.avatar} alt="" />
                <span>{post.postOwner.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{
              __html: DomPurify.sanitize(post.postDetail.description),
            }}/>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.petPolicy === 'allowed' ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income policy</span>
                <p>{post.postDetail.propertyFees}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.bedroom} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail.school > 999 ? post.postDetail.school/1000 + "Km" : post.postDetail.school + "m"} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus > 999 ? post.postDetail.bus/1000 + "Km" : post.postDetail.bus + "m"} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant > 999 ? post.postDetail.restaurant/1000 + "Km" : post.postDetail.restaurant + "m"} away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={openChatBox}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button onClick={handleSave} disabled={isDisabled} style={{backgroundColor: saved ? "#fece51" : "white"}}>
              <img src="/save.png" alt="" />
              {saved ? "Place is saved" : "Save the Place" }
            </button>
          </div>
          {error && <span>{error}</span> }
        </div>
      </div>
    </div>
  );
}

export default SinglePage;