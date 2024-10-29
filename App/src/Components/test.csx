import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { getAllQuestions } from '../Services/QuestionServices';

const Questions = () => {
  const [initialQuestionAnswered, setInitialQuestionAnswered] = useState(false);
  const [secondQuestionAnswered, setSecondQuestionAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSubQuestionIndex, setCurrentSubQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [relatedQuestionIndex, setRelatedQuestionIndex] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);

  // Hard-coded questions
  const initialQuestion = "आपण काय कारणासाठी भेटत आहात?";
  const initialOptions = [
    "नवीन जन्मलेले बाळ",
    "चांगले मूल",
    "लसीकरण",
    "पाठपुरावा",
    "नियोजित भेट",
  ];

  const secondQuestion = "आपण कोणत्या कारणामुळे ग्रस्त आहात?";
  const secondOptions = [
    "ताप",
    "खोकला",
    "सर्दी",
    "खोकला आणि सर्दी",
    "छाती दुखणे",
    "संडास लागणे",
  ];

      // Fetch sections from backend wrapped in useCallback
      const fetchQuestions = useCallback(async () => {
            const response = await getAllQuestions();
            setQuestionsData(response.data); // Assuming response.data is the array of sections

    }, []); // Include toast in the dependency array

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]); // No warning here since fetchSections is stable

  const handleInitialOptionSelect = (option) => {
    setResponses((prev) => [...prev, { question: initialQuestion, answer: option }]);
    setInitialQuestionAnswered(true);
  };

  const handleSecondOptionSelect = (option) => {
    setResponses((prev) => [...prev, { question: secondQuestion, answer: option }]);
    setSecondQuestionAnswered(true);

    // Filter questions based on the selected second question option
    const relatedQuestions = questionsData.filter(question => question.main_question === option);
    setFilteredQuestions(relatedQuestions);
    setCurrentQuestionIndex(0); // Reset to first question
  };

  if (!initialQuestionAnswered) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{initialQuestion}</Text>
        {initialOptions.map((option, index) => (
          <Button
            key={index}
            title={option}
            onPress={() => handleInitialOptionSelect(option)}
            color="#3F51B5"
          />
        ))}
      </View>
    );
  }

  if (!secondQuestionAnswered) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{secondQuestion}</Text>
        {secondOptions.map((option, index) => (
          <Button
            key={index}
            title={option}
            onPress={() => handleSecondOptionSelect(option)}
            color="#3F51B5"
          />
        ))}
      </View>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  if (!currentQuestion || !currentQuestion.sub_questions) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>No more questions available.</Text>
      </View>
    );
  }

  const currentSubQuestion = currentQuestion.sub_questions[currentSubQuestionIndex];

  const handleOptionSelect = (option) => {
    const newResponses = [...responses, { question: currentSubQuestion.sub_question, answer: option }];
    setResponses(newResponses);

    const selectedOption = currentSubQuestion.options.find(opt => typeof opt === 'object' && opt.option === option);
    
    if (selectedOption && selectedOption.related_questions) {
      setRelatedQuestions(selectedOption.related_questions);
      setRelatedQuestionIndex(0); // Start with the first related question
      setCurrentSubQuestionIndex(0); // Keep the current sub-question index
    } else {
      // Move to the next sub-question
      setCurrentSubQuestionIndex(prev => prev + 1);
    }

    // Check if we need to move to the next main question
    if (currentSubQuestionIndex + 1 >= currentQuestion.sub_questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentSubQuestionIndex(0);
      setRelatedQuestions([]); // Clear related questions when moving to next main question
    }
  };

  const renderCurrentSubQuestion = () => (
    <View>
      <Text style={styles.subQuestionText}>{currentSubQuestion.sub_question}</Text>
      {currentSubQuestion.options.map((option, index) => (
        <Button
          key={index}
          title={typeof option === 'string' ? option : option.option}
          onPress={() => handleOptionSelect(typeof option === 'string' ? option : option.option)}
          color="#3F51B5"
        />
      ))}
    </View>
  );

  const renderRelatedQuestions = () => {
    const relatedQuestion = relatedQuestions[relatedQuestionIndex];
    
    if (!relatedQuestion) return null;

    return (
      <View>
        <Text style={styles.subQuestionText}>{relatedQuestion.related_question}</Text>
        {relatedQuestion.related_options.map((option, index) => (
          <Button
            key={index}
            title={option}
            onPress={() => {
              const newResponses = [...responses, { question: relatedQuestion.related_question, answer: option }];
              setResponses(newResponses);
              setRelatedQuestionIndex(prev => prev + 1); // Move to the next related question
            }}
            color="#3F51B5"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.main_question}</Text>
      {relatedQuestions.length > 0 ? renderRelatedQuestions() : renderCurrentSubQuestion()}
      {responses.map((response, index) => (
        <Text key={index} style={styles.responseText}>{`${response.question}: ${response.answer}`}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subQuestionText: {
    fontSize: 18,
    marginVertical: 10,
    color: 'black',
  },
  responseText: {
    fontSize: 16,
    marginTop: 5,
    color: 'black',
  },
});

export default Questions;
