import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../theme';

// Screens
import LoanListScreen from '../screens/loans/LoanListScreen';
import LoanDetailScreen from '../screens/loans/LoanDetailScreen';
import CreateLoanScreen from '../screens/loans/CreateLoanScreen';
import EditLoanScreen from '../screens/loans/EditLoanScreen';
import RecordPaymentScreen from '../screens/payments/RecordPaymentScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import AnalyticsDetailScreen from '../screens/analytics/AnalyticsDetailScreen';
import MessageListScreen from '../screens/messages/MessageListScreen';
import ChatScreen from '../screens/messages/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

export type MainTabParamList = {
  LoansStack: undefined;
  Analytics: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type LoansStackParamList = {
  LoanList: undefined;
  LoanDetail: { loanId: string };
  CreateLoan: undefined;
  EditLoan: { loanId: string };
  RecordPayment: { loanId: string };
};

export type AnalyticsStackParamList = {
  Analytics: undefined;
  AnalyticsDetail: { category?: string };
};

export type MessagesStackParamList = {
  MessageList: undefined;
  Chat: { loanId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const LoansStack = createStackNavigator<LoansStackParamList>();
const AnalyticsStack = createStackNavigator<AnalyticsStackParamList>();
const MessagesStack = createStackNavigator<MessagesStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const LoansNavigator = () => (
  <LoansStack.Navigator>
    <LoansStack.Screen name="LoanList" component={LoanListScreen} options={{ title: 'Loans' }} />
    <LoansStack.Screen name="LoanDetail" component={LoanDetailScreen} options={{ title: 'Loan Details' }} />
    <LoansStack.Screen name="CreateLoan" component={CreateLoanScreen} options={{ title: 'Create Loan' }} />
    <LoansStack.Screen name="EditLoan" component={EditLoanScreen} options={{ title: 'Edit Loan' }} />
    <LoansStack.Screen name="RecordPayment" component={RecordPaymentScreen} options={{ title: 'Record Payment' }} />
  </LoansStack.Navigator>
);

const AnalyticsNavigator = () => (
  <AnalyticsStack.Navigator>
    <AnalyticsStack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
    <AnalyticsStack.Screen name="AnalyticsDetail" component={AnalyticsDetailScreen} options={{ title: 'Analytics Detail' }} />
  </AnalyticsStack.Navigator>
);

const MessagesNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen name="MessageList" component={MessageListScreen} options={{ title: 'Messages' }} />
    <MessagesStack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
  </MessagesStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    <ProfileStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
  </ProfileStack.Navigator>
);

const MainNavigator: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="LoansStack"
          component={LoansNavigator}
          options={{
            tabBarLabel: 'Loans',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsNavigator}
          options={{
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesNavigator}
          options={{
            tabBarLabel: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="message-text" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
};

export default MainNavigator;

