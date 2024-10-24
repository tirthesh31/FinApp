import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { database } from '../Firebase/firebase';
import { get, ref } from 'firebase/database';

export default function SummaryScreen() {
  const [categoryTotals, setCategoryTotals] = useState({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedDecade, setSelectedDecade] = useState(Math.floor(new Date().getFullYear() / 10) * 10); // Default to current decade
  const [totalYearlyExpenses, setTotalYearlyExpenses] = useState(0);
  const [noDataMessage, setNoDataMessage] = useState('');

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return { label: date.toLocaleString('default', { month: 'long' }), value: i};
  });

  const decades = Array.from({ length: 4 }, (_, i) => Math.floor(new Date().getFullYear() / 10) * 10 - i * 10); // Last 4 decades

  const years = Array.from({ length: 10 }, (_, i) => selectedDecade + i); // Years within the selected decade

  useEffect(() => {
    const dbRef = ref(database, 'transactions/');

    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const transactionList = Object.values(data);

        let total = 0;
        const totalsByCategory = { Work: 0, Entertainment: 0, Grocery: 0, Bill: 0 }; // Initialize categories
        let totalInYear = 0;

        transactionList.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          const transactionMonth = transactionDate.getUTCMonth()+1; // Month is 0-indexed
          const transactionYear = transactionDate.getFullYear();

          // Check if transaction matches selected month and year
          if (transactionMonth === selectedMonth && transactionYear === selectedYear) {
            const { category, amount } = transaction;

            if (!totalsByCategory[category]) {
              totalsByCategory[category] = 0;
            }
            totalsByCategory[category] += amount;

            total += amount;
          }

          // Calculate total for the selected year
          if (transactionYear === selectedYear) {
            totalInYear += transaction.amount;
          }
        });

        setCategoryTotals(totalsByCategory);
        setTotalExpenses(total);
        setTotalYearlyExpenses(totalInYear);

        if (total === 0) {
          setNoDataMessage(`No spending in ${months[selectedMonth ].label} ${selectedYear}`);
        } else {
          setNoDataMessage('');
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [selectedMonth, selectedYear]); // Run effect when month or year changes

  // Prepare data for the bar chart
  const chartData = {
    labels: ['Work', 'Entertainment', 'Grocery', 'Bill'],
    datasets: [
      {
        data: ['work', 'entertainment', 'grocery', 'bills'].map((category) => categoryTotals[category] || 0),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Your Monthly Spending Insights</Text>

      {/* Dropdown Selectors */}
      <View style={styles.dropdownRow}>
          {/* Decade Selector */}
          <Picker
            selectedValue={selectedDecade}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedDecade(itemValue)}
          >
            {decades.map((decade) => (
              <Picker.Item key={decade} label={`${decade}s`} value={decade} />
            ))}
          </Picker>

          {/* Year Selector */}
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={String(year)} value={year} />
            ))}
          </Picker>

        
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          >
            {months.map((month) => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
      </View>

      {noDataMessage ? (
        <Text style={styles.noDataText}>{noDataMessage}</Text>
      ) : (
        <>
          {/* Bar Chart View with Custom Styling */}
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 60} // Adjust for padding
              height={220}
              yAxisLabel="$"
              fromZero={true} // Ensures the chart starts at zero
              chartConfig={{
                backgroundColor: '#FFFFFF', 
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 2, // Show values with two decimal places
                color: (opacity = 1) => `rgba(34, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
                barColors: ['#FF6F61', '#6A0572', '#F7D716', '#2AB7CA'],
                barBorderRadius: 10,
                propsForBars: {
                  strokeWidth: 2, 
                  stroke: '#000000',
                  shadowColor: '#000000',
                  shadowOffset: { width: 2, height: 3 },
                  shadowOpacity: 0.6,
                  shadowRadius: 3,
                },
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', 
                  stroke: '#DDDDDD', 
                },
              }}
              verticalLabelRotation={30} 
            />
          </View>

          {/* Total Expenses */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Expenses in {months[selectedMonth].label}:</Text>
            <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Expenses In {selectedYear}:</Text>
            <Text style={styles.totalAmount}>${totalYearlyExpenses.toFixed(2)}</Text>
          </View>
        </>
      )}
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
    marginLeft:10
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    alignSelf: 'center', 
  },
  picker: {
    width: '34%',
    height: 50,
  },
  noDataText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  chartContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, 
  },
  totalContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  yearTotalText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
