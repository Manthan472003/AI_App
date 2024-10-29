import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const FinalSummary = ({ route, navigation }) => {
    const { patient, questions, answers } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>{patient.name} च वय {patient.age} आहे </Text>
                <Text style={styles.summaryText}>प्रश्न आणि उत्तरे:</Text>

                {questions.map((question, index) => (
                    <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <Text style={styles.answerText}>
                            {answers[index] || 'Not answered'}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Previous Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Questions')}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    summaryCard: {
        padding: 15,
        backgroundColor: '#E3F2FD',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 4,
    },
    questionContainer: {
        marginVertical: 10,
    },
    questionText: {
        color: '#555',
        fontWeight: 'bold',
    },
    answerText: {
        marginLeft: 10,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FinalSummary;
