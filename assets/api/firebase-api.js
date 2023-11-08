import database from '@react-native-firebase/database';
import RNFetchBlob from 'react-native-fetch-blob';


export const downloadJSONFile = async (fileUrl) => {
  console.log(fileUrl, 'fff')
  try {
    const res = await RNFetchBlob.config({
      fileCache: true,
      appendExt: 'json',
    }).fetch('GET', fileUrl);
    console.log(res.path(), 'res')
    return res.path();
  } catch (error) {
    throw new Error('Error downloading JSON file: ' + error);
  }
};

export const sendFeedback = async (feedbackData) => {
    try {
        const feedbackRef = database().ref('feedback');
        feedbackRef.push(feedbackData)
        console.log('Feedback sent successfully!');
    } catch (error) {
        console.error('Error sending feedback:', error);
        throw error;
    }
};

export const saveApplication = async (data) => {
    try {
        const certificateDataRef = database().ref('certificateApplication');
        certificateDataRef.push(data)
        console.log('Quiz data saved to Firebase Realtime Database!');
    } catch (error) {
        console.error('Error saving quiz data to Firebase:', error);
    }
};

export const fetchBlogPostsOnce = async () => {
  try {
    const snapshot = await database().ref('shortpost').once('value');
    const data = snapshot.val();
    console.log(data, 'data')
    return data ? Object.values(data) : [];
  } catch (error) {
    throw new Error('Error fetching initial blog posts: ' + error.message);
  }
}

export const fetchBlogPostByTitle = async (title) => {
    try {
      const snapshot = await database()
        .ref('posts')
        .orderByChild('title')
        .equalTo(title)
        .once('value');
  
      if (snapshot.exists()) {
        // Convert the snapshot to the actual data
        const data = snapshot.val();
        return data;
      } else {
        return null; // No matching post found
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error; // Handle the error in your component
    }
  };
  