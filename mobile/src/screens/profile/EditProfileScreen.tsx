import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button, Card, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';
import { updateProfileSchema } from '../../utils/validators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const [imageUri, setImageUri] = useState<string | null>(profile?.profilePicture || null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile?.name || '',
    },
  });

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setImageUri(profile.profilePicture || null);
    }
  }, [profile, setValue]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      await dispatch(
        updateProfile({
          name: data.name,
          profilePicture: imageUri || undefined,
        })
      ).unwrap();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            {imageUri ? (
              <Avatar.Image size={100} source={{ uri: imageUri }} />
            ) : (
              <Avatar.Text
                size={100}
                label={profile?.name?.charAt(0).toUpperCase() || 'U'}
              />
            )}
            <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
              Change Photo
            </Button>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Name"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          >
            Save Changes
          </Button>
        </Card.Content>
      </Card>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default EditProfileScreen;

