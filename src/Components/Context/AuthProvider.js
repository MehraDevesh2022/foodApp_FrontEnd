import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const AuthContext = React.createContext();
//custom hook that allows components to access context data
export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {

  const [user, userSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassEmail, setResetEmail] = useState(null);
  const [otpPassEmail, setOtpPassEmail] = useState(null);
   const history = useHistory();  


  async function signUp(name, password, email, confirm) {
    try {
      
      setLoading(true);
    console.log("auth hits", name);

      let res = await axios.post("/api/v1/auth/signup",
        {
          name: name,
          password: password,
          ConfirmPassword: confirm,
          email,
        }
      );
      if (res.status === 201) {
        alert("user signed up");
      }
      setLoading(false);
    } catch (err) {
   
      if(err.message === "Request failed with status code 400")
        alert("imporper user data entry");

      setLoading(false);
    }
  }

  async function login(email, password) {
    let flag = true;
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/auth/login",
        {
          email: email,
          password: password,
        }
      ); 
        if(res.status ===200){
         userSet(res.data.user);
         setLoading(false);
         return flag;
        }
    } catch (err) {
       flag = false;
    
       if (err.message === "Request failed with status code 404") {
         alert("user not found signup first");
       } else if (err.message === "Request failed with status code 400") {
         alert("email and password may be wrong");
       } else if (err.message === "Request failed with status code 500") {
         alert("Internal server error");
       }
       setLoading(false);
        return flag;
    }

  }

  // logout :
  function logout() {
    localStorage.removeItem("user");
    userSet(null);
    history.push("/login");
  
  }

  const value = {
    user,
    login,
    signUp,
    logout,
    resetPassEmail,
    setResetEmail,
    otpPassEmail,
    setOtpPassEmail
  };
  
  return (
    <AuthContext.Provider value={value}>
      {/* if not loading show childrens  */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
