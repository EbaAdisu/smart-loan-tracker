import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  loading = false,
  disabled = false,
  style,
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[styles.button, style]}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
});

export default Button;

