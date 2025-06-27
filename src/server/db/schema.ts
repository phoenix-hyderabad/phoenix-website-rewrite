import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  serial,
  decimal,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { pgEnum } from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["member", "por", "professor", "admin"]);
export type Role = (typeof roles.enumValues)[number];
export const teams = pgEnum("teams", ["it", "tech", "editorial", "design"]);
export type Team = (typeof teams.enumValues)[number];

export const createTable = pgTableCreator((name) => `phoenix-website_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  roles: roles("roles")
    .array()
    .notNull()
    .default(sql`'{}'::roles[]`),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const inductions = createTable("inductions", {
  name: text("name").primaryKey(),
  url: text("url").notNull(),
  isOpen: boolean("is_open").notNull().default(false),
});

export const members = createTable(
  "members",
  {
    uid: text("uid").notNull(),
    name: text("name").notNull(),
    year: integer("year").notNull(),
    ispor: boolean("ispor").notNull().default(false),
    designation: text("designation").notNull().default("Member"),
    team: teams("team"),
    project: text("project").references(() => projects.key, {
      onDelete: "set null",
    }),
    ispoc: boolean("ispoc").notNull().default(false),
    link: text("link"),
    contact: text("contact"),
  },
  (members) => ({
    compoundKey: primaryKey({
      columns: [members.uid, members.year],
    }),
  }),
);

export const news = createTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url"),
  description: text("description").notNull(),
  venue: text("venue").notNull(),
  timings: text("timings").notNull(),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const professors = createTable("professors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  qualification: text("qualification").notNull(),
  joinedBits: text("joined_bits").notNull(),
  interests: text("interests"),
  coursesTaught: text("courses_taught"),
  experience: text("experience"),
  researchLab: text("research_lab"),
});

export const projects = createTable("projects", {
  key: text("key").primaryKey(),
  name: text("name").notNull().unique(),
  cover: text("cover").notNull(),
  problemStatement: text("problem_statement").notNull(),
  current: boolean("current").default(true),
});

export const projectApplications = createTable("project_applications", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  cgpa: decimal("cgpa").notNull(),
  skills: text("skills").notNull(),
  additionalInfo: text("additional_info"),
});
