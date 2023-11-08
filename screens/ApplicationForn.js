import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { useQuiz } from '../QuizContext';
import { saveApplication } from '../assets/api/firebase-api';

const ApplicationForm = ({ isVisible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [darja, setDarja] = useState('');
  const { completeQuiz, state, resetQuiz } = useQuiz();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!city) {
      newErrors.city = 'City is required';
    }

    if (!darja) {
      newErrors.darja = 'Darja is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return email.includes('@');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Form is valid, proceed with submission
      const formData = { name, email, city, darja, time: new Date().toString()};
      onSubmit(formData)
      setName('');
      setEmail('');
      setCity('');
      setDarja('');
      // Save the form data
    } else {
      // Form is invalid, display error messages
      Alert.alert('Validation Error', 'Please correct the form errors');
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.formHeader}>Application Form</Text>
        <TextInput
          style={styles.inputField}
          placeholderTextColor={"black"}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <TextInput
          style={styles.inputField}
          placeholderTextColor={"black"}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <TextInput
          style={styles.inputField}
          placeholderTextColor={"black"}
          placeholder="City"
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        {errors.city && <Text style={styles.error}>{errors.city}</Text>}

        <TextInput
          style={styles.inputField}
          placeholderTextColor={"black"}
          placeholder="Current Darja"
          value={darja}
          onChangeText={(text) => setDarja(text)}
        />
        {errors.darja && <Text style={styles.error}>{errors.darja}</Text>}

        <View style={styles.buttonContainer}>
          <Pressable onPress={handleSubmit} style={styles.downloadButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formHeader: {
    fontSize: 20,
    marginBottom: 20,
    color: "green",
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ApplicationForm;
