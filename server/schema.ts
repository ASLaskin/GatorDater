import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"

import type { AdapterAccount } from "next-auth/adapters"

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: text("bio").notNull().default(''),
  gender: text("gender"), 
  preferencesComplete: boolean("preferencesComplete").notNull().$default(() => false),
});


export const preferences = pgTable("preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  genderPreferences: text("genderPreferences") 
});


export const matcher = pgTable("matcher", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user1: text("user1")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  user2: text("user2")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  user1Liked: boolean("user1_liked").notNull().default(false),
  user2Liked: boolean("user2_liked").notNull().default(false),
  status: text("status").notNull().$type<'pending' | 'liked' | 'unmatched'>(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const matchHistory = pgTable("match_history", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().unique(),
  matchedUserIds: text("matched_user_ids").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matchId: text("matchId")
    .notNull()
    .references(() => matcher.id, { onDelete: "cascade" }),
  senderId: text("senderId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
});


export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verficationToken) => ({
    compositePk: primaryKey({
      columns: [verficationToken.identifier, verficationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
