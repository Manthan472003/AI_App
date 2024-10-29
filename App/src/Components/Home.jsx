import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import patientsData from './patients.json'; // Adjust the path based on your structure
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Home = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        setPatients(patientsData);
    }, []);

    const handlePatientChange = (value) => {
        const patient = patients.find(p => p.id === value);
        setSelectedPatient(patient);
    };

    const handleStartPress = async () => {
        if (selectedPatient) {
            // Store selected patient ID in AsyncStorage
            await AsyncStorage.setItem('selectedPatientId', selectedPatient.id);
            // Navigate to Questions page, passing patientId, name, and age
            navigation.navigate('Questions', {
                patientId: selectedPatient.id,
                name: selectedPatient.name,
                age: selectedPatient.age,
            });
        }
    };
    

    return (
        <View style={styles.container}>
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
});

export default Home;
