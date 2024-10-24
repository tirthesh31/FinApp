import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TransactionsScreen from './screens/TransactionsScreen';
import SummaryScreen from './screens/SummaryScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import { MaterialIcons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TransactionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Transactions List" component={TransactionsScreen} />
      <Stack.Screen name="Transaction Detail" component={TransactionDetailScreen}  />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsStack} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-balance" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Summary" 
        component={SummaryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="summarize" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
    </NavigationContainer>
  );
}
