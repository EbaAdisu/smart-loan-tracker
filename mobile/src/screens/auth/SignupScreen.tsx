import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { signupSchema } from '../../utils/validators';
import { theme } from '../../theme';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await dispatch(
        signup({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
    } catch (error: any) {
      Alert.alert('Signup Failed', error?.message || 'Unable to create account');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign up to get started
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} loading={loading}>
          Sign Up
        </Button>

        <View style={styles.loginContainer}>
          <Text variant="bodyMedium">Already have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Login
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default SignupScreen;

