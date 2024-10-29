import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Summary = ({ patientLabel, ageLabel, answers }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.patientInfo}>Name: {patientLabel}</Text>
            <Text style={styles.patientInfo}>Age: {ageLabel}</Text>
            
            {/* Iterate over the answers and display question-answer pairs */}
            {answers.map((item, index) => (
                <View key={index} style={styles.answerContainer}>
                    <Text style={styles.questionText}>Question: {item.question}</Text>
                    <Text style={styles.answerText}>Answer: {item.answer}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#E0F7FA',
        borderRadius: 10,
        marginTop: 20,
    },

    patientInfo: {
        color: '#000',
        fontSize: 16,
        marginBottom: 10,
    },
    answerContainer: {
        marginBottom: 10,
    },
    questionText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    answerText: {
        fontSize: 16,
        color: '#00796B',
    },
});

export default Summary;
