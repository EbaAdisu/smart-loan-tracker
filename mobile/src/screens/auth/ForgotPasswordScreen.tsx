import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../services/api/authApi';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { theme } from '../../theme';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(data.email);
      if (response.success) {
        Alert.alert(
          'Email Sent',
          'Please check your email for password reset instructions.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Error', response.error?.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Forgot Password
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} loading={loading}>
          Send Reset Link
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          Back to Login
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  surface: {
    padding: 24,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.placeholder,
  },
  linkButton: {
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;

