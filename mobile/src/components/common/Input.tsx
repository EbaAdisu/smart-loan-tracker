import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  disabled = false,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={!!error}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      disabled={disabled}
      mode="outlined"
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});

export default Input;

