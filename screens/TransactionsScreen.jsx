import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Modal, TextInput, StyleSheet } from 'react-native';
import { database } from '../Firebase/firebase';
import { get, ref, push } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown

export default function TransactionsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('grocery'); // Initialize the category with default value
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [date, setDate] = useState(new Date()); // Set initial date to today
  const [showPicker, setShowPicker] = useState(false); // Control the visibility of the date picker

  // Function to add a new transaction
  const addTransaction = () => {
    const newTransactionRef = ref(database, 'transactions/');
console.log(amount);

    // Use push to add a transaction with a unique key
    push(newTransactionRef, {
      category: category,
      amount: parseFloat(amount),
      date: date.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
      description: description, // Add the description to the transaction
    })
    .then(() => {
      setModalVisible(false); // Close modal after successful transaction
      setCategory('grocery'); // Reset category to default
      setAmount(''); // Reset amount input
      setDescription(''); // Reset description input
      setDate(new Date()); // Reset date to today
      
      // Fetch transactions again after adding a new one
      fetchTransactions();
    })
    .catch((error) => {
      console.error("Error adding transaction: ", error);
    });
  };

  // Function to fetch transactions
  const fetchTransactions = () => {
    const dbRef = ref(database, 'transactions/');
    
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const transactionList = Object.keys(data).map((key) => ({
          id: key,
          category: data[key].category, // Properly accessing category
          amount: data[key].amount, // Properly accessing amount
          date: data[key].date, // Properly accessing date
          description: data[key].description, // Properly accessing description
        }));
        
        setTransactions(transactionList);
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  // Call fetchTransactions in useEffect to load initial data
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Transaction Detail', { transaction: item })} 
            style={styles.transactionItem}>
            <Text style={styles.transactionName}>{item.category}</Text>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionAmount}>${item.amount}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Transaction" onPress={() => setModalVisible(true)} />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>

            {/* Dropdown for category */}
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.inputDropdown}
            >
              <Picker.Item label="Grocery" value="grocery" />
              <Picker.Item label="Work" value="work" />
              <Picker.Item label="Entertainment" value="entertainment" />
              <Picker.Item label="Bills" value="bills" />
            </Picker>

            {/* Input field for amount */}
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Date picker for transaction date */}
            <TouchableOpacity 
              onPress={() => setShowPicker(true)} 
              style={[styles.input, {color: 'gray', paddingLeft:10,justifyContent:'center', height: 50 }]} // Combine styles using array
            >
              <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text> 
            </TouchableOpacity>


            {/* Input field for description */}
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.inputDescription, { height: 7 * 17 ,  textAlignVertical: 'top'}]} // Assuming line height is around 20px
              multiline={true} // Enables multiline input
              numberOfLines={7} // Sets the default number of lines to 7
            />
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                style={{ width: '100%', marginVertical: 10}} 
                onChange={(event, selectedDate) => {
                  if (event.type === 'set') {
                    setDate(selectedDate);
                  }
                  setShowPicker(false); 
                }}
              />
            )}

            {/* Buttons to submit or cancel */}
            <View style={styles.buttonView}>
              <Button title="Submit" onPress={addTransaction} />
              <View style={styles.buttonSpacer} /> 
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  transactionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 5,
  },
  transactionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 16,
    color: '#007BFF',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    height:400
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft:10
  },
  inputDescription: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
    paddingLeft: 10,
    paddingTop: 10,
    borderRadius: 5,
  },
  inputDropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 40, 
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 10, 
  },
  buttonSpacer: {
    width: 10, 
  },
});
