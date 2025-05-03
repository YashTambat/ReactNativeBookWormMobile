import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG_URL, API_URL} from "../constants/api"
export const useAuthStore = create((set)=>({
user:null,
token :null,
isloading:false,
isCheckingAuth:true,

register:async(username,email ,password)=>{
  console.log("check username ,email ,password :",username,email,password)
  set({isloading:true});
  try {
    console.log(" inside check username ,email ,password :",username,email,password)
    const response= await fetch(`${API_CONFIG_URL}/auth/register`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        username,
        email,
        password
      })
    })
    const data = await response.json();
    if(!response.ok) throw new Error(data.message || "Somthing went wrong");
    await AsyncStorage.setItem("user" ,JSON.stringify(data.user))
    await AsyncStorage.setItem("token" ,data.token)

    set({
      token:data.token,
      user:data.user,
      isloading:false 
    })
    return{success:true}

  } catch (error) {
    set({isloading:false})
    return{success:false ,error:error.message}
  }
},

checkAuth: async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userjson = await AsyncStorage.getItem("user")
    const user = userjson ?  JSON.parse(userjson) : null;

    set({token,user})
  } catch (error) {
    console.log("Auth check failed",error) 
  }finally{
    set({isCheckingAuth:false});
  }

},

login:async(email,password)=>{
  set({isloading:true})

  try {
    const response= await fetch(`${API_CONFIG_URL}/auth/login`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    const data = await response.json();
    if(!response.ok) throw new Error(data.message || "Somthing went wrong");
    await AsyncStorage.setItem("user" ,JSON.stringify(data.user))
    await AsyncStorage.setItem("token" ,data.token)

    set({
      token:data.token,
      user:data.user,
      isloading:false 
    })
    return{success:true}
  } catch (error) {
    set({isloading:false})
    return{success:false ,error:error.message}
  }

},


logout: async()=>{
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  set({user:null ,token:null});

}


}));