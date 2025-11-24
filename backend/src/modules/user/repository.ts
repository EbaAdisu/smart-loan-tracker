import { db } from "../../core/db/firebase";
import { UserProfile } from "./model";

const COLLECTION = "users";

export class UserRepository {
    static async findById(uid: string): Promise<UserProfile | null> {
        const doc = await db.collection(COLLECTION).doc(uid).get();
        if (!doc.exists) return null;
        return doc.data() as UserProfile;
    }

    static async create(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const now = new Date().toISOString();
        const user: UserProfile = {
            uid,
            email: data.email || "",
            displayName: data.displayName,
            photoURL: data.photoURL,
            deviceTokens: data.deviceTokens || [],
            lastLogin: now,
            createdAt: now,
            updatedAt: now,
        };

        await db.collection(COLLECTION).doc(uid).set(user);
        return user;
    }

    static async update(uid: string, data: Partial<UserProfile>): Promise<void> {
        await db.collection(COLLECTION).doc(uid).update({
            ...data,
            updatedAt: new Date().toISOString(),
        });
    }

    static async addDeviceToken(uid: string, token: string): Promise<void> {
        const userRef = db.collection(COLLECTION).doc(uid);
        // Use arrayUnion to add unique tokens
        await userRef.update({
            deviceTokens: require("firebase-admin/firestore").FieldValue.arrayUnion(token),
            updatedAt: new Date().toISOString(),
        });
    }
}
