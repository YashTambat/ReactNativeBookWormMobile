import { View, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'expo-router';
import { API_CONFIG_URL } from '../../constants/api';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import { sleep } from '.';
import Loader from '../../components/Loader';

export default function Profile() {
  const [books,setBooks] =useState([]);
  const [isloading,setIsloading] =useState(true);
  const [refreshing,setRefreshing] =useState(false);
  const [deleteBookId,setdeleteBookId] =useState(null);

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
  const handleDeleteBook =async(bookId)=>{
    console.log("check book id :",bookId)
    try {
      setdeleteBookId(bookId)
      const response =  await fetch(`${API_CONFIG_URL}/books/${bookId}`,{
        method:"DELETE",
        headers:{Authorization:`Bearer ${token}`},
      })
      console.log("Check response: ",response)
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to delete book");
      setBooks(books.filter((book)=>book._id!==bookId));
      Alert.alert("Success","Recomendation deleted Successfully");
      console.log("delete success")
    } catch (error) {
      Alert.alert("Error",error.message || "Failed to delete recomendation")
      console.log("delete not")
    }finally{
      setdeleteBookId(null)
    }

  }

  const confirmDelete = (bookId)=>{
    Alert.alert("Delete Recomendation","Are you sure you want to delete  this recomendation?",[
      {text:"Cancle",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:()=>handleDeleteBook(bookId)},
    ])
  }

  const renderBookItem = ({item})=>(
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage}/>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleString()}</Text>  
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={()=>confirmDelete(item._id)}>

        {deleteBookId===item._id?(
          <ActivityIndicator size='small' color={COLORS.primary}/>
        ):(
        <Ionicons name='trash-outline' size={20} color={COLORS.primary}/>
        )}
      
      </TouchableOpacity>

    </View>
)

const renderRatingStars =(rating)=>{
  const stars=[];
  for(let i=1;i<=5;i++){
    stars.push(
      <Ionicons
      key={i}
      name={i<=rating?"star":"star-outline"}
      size={14}
      color={i<=rating?"#f4b400":COLORS.textSecondary}
      style={{marginRight:2}}
      />
    );
  }
  return stars;
}

const  handleRefresh =async()=>{
  setRefreshing(true);
  await sleep(500)
  await fetchData(true);
  setRefreshing(false)
}

if(isloading && !refreshing) return <Loader/>

  return (
    <View style={styles.container}>
      <ProfileHeader/>
      <LogoutButton/>

      {/* Your recomendation */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recomendation</Text>
        <Text style={styles.booksCount}>{books.length}books</Text>
      </View>

      <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item)=>item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.booksList}

     refreshControl={       
           <RefreshControl
           refreshing={refreshing}
           onRefresh={handleRefresh}
           color={COLORS.primary}
           tintColor={COLORS.primary}   
           />
          }

      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name='book-outline' size={50} color={COLORS.textSecondary}/>
          <Text style={styles.emptyText}>No Recomendation yet</Text>
          <TouchableOpacity style={styles.addButton} onPress={()=>router.push("/create")}>
          <Text style={styles.addButtonText}>Add your First Book</Text>  
          </TouchableOpacity>  
        </View>
      }

      />
    </View>
  )
}