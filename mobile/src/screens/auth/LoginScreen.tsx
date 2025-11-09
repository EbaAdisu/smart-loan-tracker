import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { loginSchema } from '../../utils/validators';
import { theme } from '../../theme';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await dispatch(login(data)).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Invalid email or password');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to continue
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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} loading={loading}>
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.linkButton}
        >
          Forgot Password?
        </Button>

        <View style={styles.signupContainer}>
          <Text variant="bodyMedium">Don't have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Signup')}
            style={styles.linkButton}
          >
            Sign up
          </Button>
        </View>
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;

