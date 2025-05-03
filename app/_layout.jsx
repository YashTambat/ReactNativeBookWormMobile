// import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import SafeScreen from '../components/SafeScreen';
// import { StatusBar } from "expo-status-bar";
// import {useAuthStore} from '../store/authStore';
// import { useEffect } from "react";
// import {useFonts} from 'expo-font';

// SplashScreen.preventAutoHideAsync();
// export default function RootLayout() {
//   const router  = useRouter();
//   const segments =  useSegments();  // it give which routes u are in
//   console.log("segment : ",segments)
//   const {checkAuth , user , token}= useAuthStore();

//   const [fontsLoaded]= useFonts({
//     "JetBrainsMono-Medium":require("../assets/fonts/JetBrainsMono-Medium.ttf"),
//   })

//   useEffect(()=>{
//     if(fontsLoaded) SplashScreen.hideAsync();
//   },[fontsLoaded])

//   useEffect(()=>{
//     checkAuth()
//   },[])

//   // handle the navigation based  on auth states
//   useEffect(()=>{
//     const inAuthScreen = segments[0]==='(auth)';
//     const isSignedIn = user && token;
//     if(!isSignedIn && !inAuthScreen) router.replace("/(auth)")
//     else if(isSignedIn && inAuthScreen) router.replace("/(tabs)")
//   },[user,token,segments])

//   return (
//   <SafeAreaProvider>
    
//   <SafeScreen>
//   <Stack  screenOptions={{headerShown:false}}>
//   <Stack.Screen name="(tabs)"/>
//   <Stack.Screen name="(auth)"/>
  
//   </Stack>
//   </SafeScreen>
//   <StatusBar style="dark"/>
//   </SafeAreaProvider>
//   );
// }













import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from '../components/SafeScreen';
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  const [authChecked, setAuthChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Check auth once on startup
  useEffect(() => {
    const runCheck = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    runCheck();
  }, []);

  // Only hide splash when fonts and auth are ready
  useEffect(() => {
    if (fontsLoaded && authChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authChecked]);

  // Avoid navigation until everything is ready
  useEffect(() => {
    if (!authChecked || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, token, segments, authChecked, fontsLoaded]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
