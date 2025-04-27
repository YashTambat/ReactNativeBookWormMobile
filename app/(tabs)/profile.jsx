import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'expo-router';
import { API_CONFIG_URL } from '../../constants/api';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';

export default function Profile() {
  const [books,setBooks] =useState([]);
  const [isloading,setIsloading] =useState(true);
  const [refreshing,setRefreshing] =useState(false);

  const {token} = useAuthStore();
  const router = useRouter();
  const fetchData = async()=>{
    try {
      setIsloading(true);
      const response = await fetch(`${API_CONFIG_URL}/books/user`,{
        headers:{Authorization:`Bearer ${token}`},
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to fetch user Data");
      setBooks(data);

      
    } catch (error) {
      console.error("Error fetching data:",error);
      Alert.alert("Error","Failed to load profile data .pull down to refresh");
    }finally{
      setIsloading(false);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <View style={styles.container}>
      <ProfileHeader/>
      <LogoutButton/>

      {/* Your recomendation */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recomendation</Text>
        <Text style={styles.bookTitle}>Your Recomendation</Text>

      </View>
    </View>
  )
}