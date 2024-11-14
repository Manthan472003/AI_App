import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import patientsData from './patients.json';
import { useNavigation } from '@react-navigation/native';
import { getAllSummaries } from '../Services/SummaryServices';

const Home = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [patientSummaries, setPatientSummaries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        setPatients(patientsData);
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            fetchPatientSummaries(selectedPatient.id);
        }
    }, [selectedPatient]);

    const fetchPatientSummaries = async (patientId) => {
        try {
            const response = await getAllSummaries();
            const storedSummaries = response.data;

            // console.log("storedSummaries :", response.data);
            const summariesArray = storedSummaries ? JSON.parse(storedSummaries) : [];
            // console.log(summariesArray);
            const filteredSummaries = summariesArray.filter(summary => summary.patientId === patientId);
            setPatientSummaries(filteredSummaries);
        } catch (error) {
            console.error('Error fetching summaries:', error);
        }
    };

    const handlePatientChange = (value) => {
        const patient = patients.find(p => p.id === value);
        setSelectedPatient(patient);
    };

    const handleStartPress = async () => {
        if (selectedPatient) {
            await AsyncStorage.setItem('selectedPatientId', selectedPatient.id);
            navigation.navigate('Questions', {
                patientId: selectedPatient.id,
                name: selectedPatient.name,
                age: selectedPatient.age,
            });
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Select Patient</Text>
            <Dropdown
                style={styles.dropdown}
                data={patients}
                labelField="name"
                valueField="id"
                placeholder="Select a patient"
                value={selectedPatient ? selectedPatient.id : null}
                onChange={item => handlePatientChange(item.id)}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
            />

            {selectedPatient && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsText}>Name: <Text style={styles.highlight}>{selectedPatient.name}</Text></Text>
                    <Text style={styles.detailsText}>DOB: <Text style={styles.highlight}>{selectedPatient.dob}</Text></Text>
                    <Text style={styles.detailsText}>Phone: <Text style={styles.highlight}>{selectedPatient.phone}</Text></Text>
                    <Text style={styles.detailsText}>Age: <Text style={styles.highlight}>{selectedPatient.age}</Text></Text>
                </View>
            )}

            <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
                <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>

            {/* Patient Summaries */}
            {patientSummaries.length > 0 && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Patient Summary</Text>
                    {patientSummaries.map((summary, index) => (
                        <View key={index} style={styles.summaryCard}>
                            <Image source={require('../Assets/share.png')} style={styles.shareIcon} />
                            <Text style={styles.summaryText}>Date: <Text style={styles.highlight}>{new Date(summary.date).toLocaleDateString()}</Text></Text>
                            <View style={styles.tagsContainer}>
                                {summary.summary.split(',').map((item, idx) => (
                                    <View key={idx} style={styles.tagBox}>
                                        <Text style={styles.tagText}>{item.trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    label: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    dropdown: {
        height: 50,
        borderColor: '#3F51B5',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
    },
    placeholderStyle: {
        color: '#888',
        fontSize: 16,
    },
    selectedTextStyle: {
        color: '#333',
        fontSize: 16,
    },
    itemTextStyle: {
        color: '#333',
        fontSize: 16,
    },
    detailsContainer: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#E3F2FD',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        width: '100%',
    },
    detailsText: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
    },
    highlight: {
        fontWeight: 'bold',
        color: '#3F51B5',
    },
    startButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        elevation: 3,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    summaryContainer: {
        marginTop: 30,
        width: '100%',
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    shareIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        tintColor: '#3F51B5',
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagBox: {
        backgroundColor: '#E3F2FD',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        color: '#3F51B5',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Home;
