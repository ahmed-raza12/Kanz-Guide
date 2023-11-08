import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { downloadJSONFile } from '../assets/api/firebase-api'; // Import your function for retrieving post details

const BlogScreen = ({ route, navigation }) => {
  const { link } = route.params;
  console.log(link, route.params, 'route')
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchJSONFile = async () => {
    try {
      const filePath = await downloadJSONFile(link);
      const response = await fetch(`file://${filePath}`)
      const data = await response.json();
      setPostDetails(data)
      setLoading(false)
      console.log(data, 'json data')
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    console.log(postDetails, 'post')
    fetchJSONFile();
  }, []);

  // Function to render formatted details with headings and bold text
  const renderFormattedArticle = () => {
    navigation.setOptions({
      title: postDetails.title
    })
    console.log(postDetails, postDetails?.details, 'detailssss'); // Use optional chaining (?.)
    if (!postDetails || !postDetails?.details) {
      return null;
    }

    const formattedArticle = postDetails.details.map((detail, index) => {
      if (detail.startsWith('#')) {
        // Render heading with #
        return (
          <Text key={index} style={styles.heading}>
            {detail.substring(1)}
          </Text>
        );
      } else {
        // Split text into bold and regular segments using **
        const segments = detail.split('**');
        return (
          <Text key={index} style={styles.paragraph}>
            {segments.map((segment, segIndex) => {
              if (segIndex % 2 === 1) {
                // Render bold text
                return (
                  <Text key={segIndex} style={styles.boldText}>
                    {segment}
                  </Text>
                );
              } else {
                // Render regular text
                return segment;
              }
            })}
          </Text>
        );
      }
    });

    return (
      <View style={styles.detailsContainer}>
        {formattedArticle}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Image source={{ uri: postDetails.image }} style={styles.image} />
          <Text style={styles.title}>{postDetails.title}</Text>
          <Text style={styles.date}>{postDetails.date}</Text>
          {renderFormattedArticle()}
        </View>
      )}

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "black"
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: "black"
  },
  boldText: {
    fontWeight: 'bold',
    color: "black",
    fontSize: 18
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 4,
    color: "black"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
  },
});

export default BlogScreen;
