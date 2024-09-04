import apiRequest  from "../lib/apiRequest.js"
import { defer } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"
import { useContext } from "react"



export const singlePageLoader = async ({request, params}) => {
    const res = await apiRequest.get("/posts/"+params.id)
    return res.data.data ? res.data.data : null
}

export const listPageLoader = async({request, params}) => {
    const query = request.url.split("?")[1]
    const postPromise = apiRequest.get("/posts?" + query)
    console.log("Here is postPromise: ",postPromise)
    console.log(request)
    console.log("Query is: ",query)
    return defer({
        postResponse: postPromise
    })
}

export const profilePageLoader = async () => {
    const postPromise = apiRequest.get("/user/profile/Posts");
    const chatPromise = apiRequest("/chatRooms");
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  };