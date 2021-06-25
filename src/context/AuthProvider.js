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
  
    function createUser(name,phoneNumber,address,cardType,cardNumber,state,district,rationDealer,user_id)
    {
      return new Promise((resolve, reject) => {
        db.collection("users").doc(user_id).get().then((doc)=>{
            if(!doc.exists)
            {
                db.collection("users").doc(user_id).set({
                    displayName:name,
                    uid:user_id,
                    phoneNumber:phoneNumber,
                    address,
                    cardType,
                    cardNumber,
                    state,
                    district,
                    rationDealer,
                    isPeople:true,
                    isVerified:false
                }).then(()=>{
                  setCurrentUser({
                    displayName:name,
                    uid:user_id,
                    phoneNumber:phoneNumber,
                    address,
                    cardType,
                    cardNumber,
                    state,
                    district,
                    rationDealer,
                    isPeople:true,
                    isVerified:false
                })

                resolve()
                })
            } else 
            {
                resolve()
                setCurrentUser(doc.data())
            }
        })
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
    }

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
    )
}