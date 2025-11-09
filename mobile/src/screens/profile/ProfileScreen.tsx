import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { logout } from '../../store/slices/authSlice';
import { fetchProfile } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const { loans } = useSelector((state: RootState) => state.loans);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logout());
        },
      },
    ]);
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  const displayProfile = profile || user;
  const totalLoans = loans.length;
  const activeLoans = loans.filter((l) => l.status === 'active').length;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={displayProfile?.name?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {displayProfile?.name}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {displayProfile?.email}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Statistics
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statValue}>
                {totalLoans}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Loans
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statValue}>
                {activeLoans}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Active Loans
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.button}
        >
          Edit Profile
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Notifications')}
          style={styles.button}
        >
          Notifications
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.button, styles.logoutButton]}
          buttonColor={theme.colors.error}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: theme.colors.placeholder,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    color: theme.colors.placeholder,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;

