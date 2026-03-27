import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  subscribers: defineTable({
    email: v.string(),
    list: v.union(v.literal("book"), v.literal("newsletter")),
  })
    .index("by_email_list", ["email", "list"])
    .index("by_list", ["list"]),

  moods: defineTable({
    mood: v.string(),
    album: v.optional(v.string()),
  }),

  sentPosts: defineTable({
    slug: v.string(),
    type: v.string(),
  }).index("by_slug_type", ["slug", "type"]),
});
