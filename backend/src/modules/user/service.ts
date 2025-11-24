import { UserRepository } from "./repository";
import { UserProfile } from "./model";
import { NotFoundError } from "../../core/errors";

export class UserService {
    static async getProfile(uid: string): Promise<UserProfile> {
        const user = await UserRepository.findById(uid);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }

    static async syncProfile(uid: string, email: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const existing = await UserRepository.findById(uid);
        if (existing) {
            await UserRepository.update(uid, data);
            return { ...existing, ...data };
        }
        return UserRepository.create(uid, { ...data, email });
    }

    static async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        await UserRepository.update(uid, data);
    }

    static async addDeviceToken(uid: string, token: string): Promise<void> {
        await UserRepository.addDeviceToken(uid, token);
    }
}
