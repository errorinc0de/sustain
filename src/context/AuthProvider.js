import React, { useContext, useState, useEffect } from "react"
import { auth, db, verifyOTP } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
  
    function signup(email, password, name) {
        return new Promise((resolve, reject) => {
            auth.createUserWithEmailAndPassword(email, password).then(function(result) {
            const user = auth.currentUser;
            user.updateProfile({
                displayName: name
            }).then((result)=> {
                db.collection("users").doc(user.uid).set({
                    displayName: name,
                    uid: user.uid,
                    email: email
                }).then(()=>{
                    resolve()
                })
                .catch(error => reject("error creating profile"));
            })
            .catch(error => reject(error));
            })
            .catch(error => reject(error));
        })
    }
  
    function createUser(payload)
    {
        db.collection("users").doc(payload.user_id).onSnapshot((doc)=>{
    
            if(!doc.exists)
            {
                db.collection("users").doc(payload.user_id).set({
                    displayName:"",
                    uid:payload.user_id,
                    phoneNumber:payload.identifier
                })
            } else {
                setCurrentUser(doc.data())
            }
        })
    }

    function login(email, password) {
        return new Promise((resolve, reject) => {
          db.collection("users").where("email","==",email).onSnapshot((docs)=>{
            if(!docs.empty)
            {
              docs.forEach(doc=>{
                if(doc.exists)
              {
                  if(doc.data().isGovernment === undefined && doc.data().isShop === undefined && doc.data().isCompany === undefined) 
                  {
                    auth.signInWithEmailAndPassword(email, password).then(() => {
                      resolve()
                    })
                    .catch(error => reject(error));
                  }
                  else
                  {
                    reject({message:"Not registered as an user"})
                  }
              }
              else
              {
                reject({message:"no such account exists"})
              }
              })
            }
            else
            {
              reject({message:"no such account exists"})
            }
          })
        })
    }

    function logout() {
        sessionStorage.clear();  
            setCurrentUser()
        return auth.signOut()
      }
    
      function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
      }
    
      function updateEmail(email) {
        return currentUser.updateEmail(email)
      }
    
      function updatePassword(password) {
        return currentUser.updatePassword(password)
      }




      // Register goverment employees
      function GovSignup(email, password, name , state) {
        return new Promise((resolve, reject) => {
            auth.createUserWithEmailAndPassword(email, password).then(function(result) {
            const user = auth.currentUser;
            user.updateProfile({
                displayName: name
            }).then((result)=> {
                db.collection("users").doc(user.uid).set({
                    displayName: name,
                    uid: user.uid,
                    email: email,
                    state:state,
                    isGovt : true
                }).then(()=>{
                    resolve()
                })
                .catch(error => reject("error creating profile"));
            })
            .catch(error => reject(error));
            })
            .catch(error => reject(error));
        })
    }


      // Login goverment employees
      function GovLogin(email, password) {
        return new Promise((resolve, reject) => {
          db.collection("users").where("email","==",email).onSnapshot((docs)=>{
            if(!docs.empty)
            {
              docs.forEach(doc=>{
                if(doc.exists)
                {
                    if(doc.data().isUser === undefined && doc.data().isShop === undefined && doc.data().isCompany === undefined) 
                    {
                      auth.signInWithEmailAndPassword(email, password).then(() => {
                        resolve()
                      })
                      .catch(error => reject(error));
                    }
                    else
                    {
                      reject({message:"Not registered as an user"})
                    }
                }
                else
                {
                  reject({message:"no such account exists"})
                }
              })
            }
            else
            {
              reject({message:"no such account exists"})
            }
          })
        })
    }













// register

  function peopleRegister(phoneNumber,captcha) {
    return new Promise((resolve, reject) => {
      console.log("yo")
        auth.signInWithPhoneNumber("+91"+phoneNumber, captcha).then((confirmationResult) => {
          resolve()
        })
        .catch(error => reject(error))
    })
  }

function registerConfirmation(phoneNumber,name,cardNumber,address,cardType,rationDealer,state,stateName,district,otp) {
  return new Promise((resolve, reject) => {


  })
}































    
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if(user && user.uid)
          {
            db.collection("users").doc(user.uid).get().then((docs)=>{
              if(!docs.empty)
                {
                  setCurrentUser(docs.data())
                  setLoading(false)
                }
              })
          }else
            setLoading(false)
          
        })
    
        return unsubscribe
      }, [])
    
    
    
      const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        createUser,
        GovSignup,
        GovLogin,
        peopleRegister,
        registerConfirmation
    }

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
    )
}