import { t } from "elysia";

export const UserProfileSchema = t.Object({
    uid: t.String(),
    email: t.String({ format: "email" }),
    displayName: t.Optional(t.String()),
    photoURL: t.Optional(t.String()),
    deviceTokens: t.Array(t.String()),
    lastLogin: t.String({ format: "date-time" }),
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
});

export type UserProfile = typeof UserProfileSchema.static;

export const CreateUserSchema = t.Object({
    displayName: t.Optional(t.String()),
    photoURL: t.Optional(t.String()),
    deviceToken: t.Optional(t.String()),
});

export const UpdateUserSchema = t.Partial(
    t.Object({
        displayName: t.String(),
        photoURL: t.String(),
        deviceToken: t.String(), // For adding a single token
    })
);
