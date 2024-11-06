import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import questionsData from './relatedQuestions.json';


const Questions = () => {
  const route = useRoute();
  const { name: patientName, age: patientAge } = route.params;

  const [initialQuestionAnswered, setInitialQuestionAnswered] = useState(false);
  const [secondQuestionAnswered, setSecondQuestionAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSubQuestionIndex, setCurrentSubQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [relatedQuestionIndex, setRelatedQuestionIndex] = useState(0);
  const navigation = useNavigation(); // Initialize navigation


  const initialQuestion = "आपण काय कारणासाठी भेटत आहात?";
  const initialOptions = ["नवीन जन्मलेले बाळ", "चांगले मूल", "लसीकरण", "पाठपुरावा", "नियोजित भेट"];
  const secondQuestion = "आपण कोणत्या कारणामुळे ग्रस्त आहात?";
  const secondOptions = ["ताप", "खोकला", "सर्दी", "खोकला आणि सर्दी", "छाती दुखणे", "संडास लागणे"];


  const handleInitialOptionSelect = (option) => {
    setResponses((prev) => [...prev, { question: initialQuestion, answer: option }]);
    setInitialQuestionAnswered(true);
  };

  const handleSecondOptionSelect = (option) => {
    setResponses((prev) => [...prev, { question: secondQuestion, answer: option }]);
    setSecondQuestionAnswered(true);

    const relatedQuestions = questionsData.filter(question => question.main_question === option);
    setFilteredQuestions(relatedQuestions);
    setCurrentQuestionIndex(0);
  };

  const handleOptionSelect = (option) => {
    const newResponses = [...responses, { question: currentSubQuestion.sub_question, answer: option }];
    setResponses(newResponses);

    const selectedOption = currentSubQuestion.options.find(opt => typeof opt === 'object' && opt.option === option);

    if (selectedOption && selectedOption.related_questions) {
      setRelatedQuestions(selectedOption.related_questions);
      setRelatedQuestionIndex(0);
      setCurrentSubQuestionIndex(0);
    } else {
      setCurrentSubQuestionIndex(prev => prev + 1);
    }

    if (currentSubQuestionIndex + 1 >= currentQuestion.sub_questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentSubQuestionIndex(0);
      setRelatedQuestions([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const selectedPatientId = await AsyncStorage.getItem('selectedPatientId');
      if (!selectedPatientId) {
        Alert.alert("Error", "Patient ID not found.");
        return;
      }
  
      // Prepare the summary data
      const summary = responses.map(response => response.answer).join(', ');
  
      // Retrieve existing summaries from AsyncStorage or initialize an empty array
      const existingSummaries = await AsyncStorage.getItem('patientSummaries');
      const summariesArray = existingSummaries ? JSON.parse(existingSummaries) : [];
  
      // Add the new summary entry
      summariesArray.push({
        patientId: selectedPatientId,
        summary,
        date: new Date().toISOString(), // Add a timestamp for reference
      });
  
      // Store the updated array back in AsyncStorage
      await AsyncStorage.setItem('patientSummaries', JSON.stringify(summariesArray));

      fetchSummaries();

  
      navigation.navigate('Home');
  
      Alert.alert("Success", "Summary saved successfully.");
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving the summary.");
      console.error("Save summary error:", error);
    }
  };
  

  const fetchSummaries = async () => {
    try {
      const storedSummaries = await AsyncStorage.getItem('patientSummaries');
      if (storedSummaries) {
        const summariesArray = JSON.parse(storedSummaries);
        console.log('Stored Summaries:', summariesArray);
      } else {
        console.log('No summaries found');
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };


  if (!initialQuestionAnswered) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.questionText}>{initialQuestion}</Text>
        {initialOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleInitialOptionSelect(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (!secondQuestionAnswered) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.questionText}>{secondQuestion}</Text>
        {secondOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleSecondOptionSelect(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentSubQuestion = currentQuestion?.sub_questions[currentSubQuestionIndex];
  const allQuestionsAnswered = currentQuestionIndex >= filteredQuestions.length && relatedQuestionIndex >= relatedQuestions.length;

  if (allQuestionsAnswered) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.patientInfo}>पेशंटचे नाव : <Text style={styles.highlight}>{patientName}</Text></Text>
          <Text style={styles.patientInfo}>पेशंटचे वय : <Text style={styles.highlight}>{patientAge}</Text></Text>
          {responses.map((response, index) => (
            <View key={index} style={styles.responseContainer}>
              <Text style={styles.questionTextBold}>{`${response.question}:`}</Text>
              <Text style={styles.answerText}>{response.answer}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const renderCurrentSubQuestion = () => (
    <View style={styles.questionCard}>
      <Text style={styles.subQuestionText}>{currentSubQuestion.sub_question}</Text>
      {currentSubQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleOptionSelect(typeof option === 'string' ? option : option.option)}
        >
          <Text style={styles.buttonText}>{typeof option === 'string' ? option : option.option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRelatedQuestions = () => {
    const relatedQuestion = relatedQuestions[relatedQuestionIndex];

    if (!relatedQuestion) return null;

    return (
      <View style={styles.questionCard}>
        <Text style={styles.subQuestionText}>{relatedQuestion.related_question}</Text>
        {relatedQuestion.related_options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              const newResponses = [...responses, { question: relatedQuestion.related_question, answer: option }];
              setResponses(newResponses);
              setRelatedQuestionIndex(prev => prev + 1);
            }}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.main_question}</Text>
      {relatedQuestions.length > 0 ? renderRelatedQuestions() : renderCurrentSubQuestion()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  questionText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796B',
  },
  questionTextBold: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004D40',
  },
  answerText: {
    fontSize: 18,
    color: '#424242',
  },
  patientInfo: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00796B',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  subQuestionText: {
    fontSize: 20,
    marginVertical: 15,
    color: '#004D40',
  },
  responseContainer: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#3F51B5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    elevation: 3,
    borderColor: '#00796B',
    borderWidth: 2,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00796B',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default Questions;