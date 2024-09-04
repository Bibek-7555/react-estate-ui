import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'
import apiRequest from '../lib/apiRequest.js'
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();


export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            console.log("The user is: ",JSON.parse(storedUser));
            return JSON.parse(storedUser);
          } catch (error) {
            console.error("Failed to parse JSON from local storage:", error);
            return null; // Default to null if parsing fails
          }
        }
        return null;
      });

      const updateUser = (data) => {
        setCurrentUser(data)
      }

      async function refreshAccessToken() {
        try {
          console.log("In try block of refreshAccessToken")
          const response = await apiRequest.patch("/auth/refresh")
          console.log(response);
          updateUser(response.data.data);
        } catch (error) {
          console.log(error)
          updateUser(null);
        }
      }

      function setupSilentRefresh() {
        setInterval(async () => {
          console.log("In setInterval")
          await refreshAccessToken();
        }, 4 * 60 * 1000); // Check every 4 minutes
      }

      function initializeAuth() {
        console.log("Going to initialize");
        refreshAccessToken();
        setupSilentRefresh();
      }


    useEffect(() => {
      initializeAuth();
    }, [])
   

      
      
      // Initialize authentication
      
      
      // Call this when your app starts
    useEffect(() => {
        console.log("Eithi haba stringify", currentUser)
        if (currentUser !== null) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("user");
        }
    }, [currentUser])

    return (
        <AuthContext.Provider value={{currentUser, updateUser}}>{children}</AuthContext.Provider>
    )
}