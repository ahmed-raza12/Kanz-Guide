import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchBlogPostsOnce, listenForNewBlogPosts, downloadJSONFile } from '../assets/api/firebase-api';


function ManaraScreen({ route, navigation }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true)
  const jsonFileUrl = 'https://drive.google.com/uc?id=1GcNjXR0SWjtymA8t1BpwhUaHHgO0ijiY'
  const fetchJSONFile = async () => {
    setLoading(true);
    try {
      const filePath = await downloadJSONFile(jsonFileUrl);
      const response = await fetch(`file://${filePath}`);

      const data = await response.json();
      setBlogPosts(data)
      console.log(data, 'json data')
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(blogPosts, 'blogpost')
    fetchJSONFile();
  }, []);


  const handlePostClick = (post) => {
    console.log(post, 'short post')
    navigation.navigate('BlogScreen', { link: post.link });
  };

  const renderShortPost = ({ item }) => {
    console.log(item, 'item')
    const words = item.description.split(' ');
    const truncatedDescription =
      words.length > 17 ? words.slice(0, 17).join(' ') + ' ...' : item.description;

    return (
      <TouchableOpacity style={styles.postContainer} onPress={() => handlePostClick(item)}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postDate}>{item.date}</Text>
          <Text style={styles.postDescription}>{truncatedDescription}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {
        loading ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="purple" />
          </View>
          :
          <FlatList
            data={blogPosts}
            keyExtractor={(item) => item.id}
            renderItem={renderShortPost}
            contentContainerStyle={styles.postList}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
  },
  postList: {
    paddingTop: 8,
  },
  postContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  postContent: {
    flex: 1,
    padding: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000"
  },
  postDate: {
    fontSize: 14,
    color: '#777',
  },
  postDescription: {
    fontSize: 16,
    color: "gray"
  },
});

export default ManaraScreen;
