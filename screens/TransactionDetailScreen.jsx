import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransactionDetailScreen({ route }) {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>

      {/* Category with larger font size */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryValue}>{transaction.category.toUpperCase()}</Text>
      </View>

      {/* Amount and Date in one line */}
      <View style={styles.inlineCard}>
        <View style={styles.inlineItem}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>${transaction.amount}</Text>
        </View>

        <View style={styles.inlineItem}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionCard}>
        <Text style={styles.detailLabel}>Description:</Text>
        <Text style={styles.descriptionText}>{transaction.description || 'No description provided.'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d2d2d',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems:'center'
  },
  categoryLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryValue: {
    fontSize: 28, // Larger font for the category value
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 5,
  },
  inlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inlineItem: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent:'center',
  },
  detailLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  detailValue: {
    fontSize: 18,
    color: '#333',
  },
  descriptionCard: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 15,
    margin: 8,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
