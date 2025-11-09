import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // Secure storage for sensitive data
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw error;
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure item:', error);
    }
  }

  // AsyncStorage for non-sensitive data
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing item:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  // Specific methods for app data
  async setSessionToken(token: string): Promise<void> {
    await this.setSecureItem(STORAGE_KEYS.SESSION_TOKEN, token);
  }

  async getSessionToken(): Promise<string | null> {
    return await this.getSecureItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  async removeSessionToken(): Promise<void> {
    await this.removeSecureItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  async setUserData(user: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  async getUserData(): Promise<any | null> {
    const data = await this.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  async removeUserData(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  async setLoansCache(loans: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.LOANS_CACHE, JSON.stringify(loans));
  }

  async getLoansCache(): Promise<any[] | null> {
    const data = await this.getItem(STORAGE_KEYS.LOANS_CACHE);
    return data ? JSON.parse(data) : null;
  }

  async clearAll(): Promise<void> {
    await this.removeSessionToken();
    await this.removeUserData();
    await this.removeItem(STORAGE_KEYS.LOANS_CACHE);
  }
}

export const storageService = new StorageService();

