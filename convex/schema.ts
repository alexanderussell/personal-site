import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  subscribers: defineTable({
    email: v.string(),
    list: v.union(v.literal("book"), v.literal("newsletter")),
  })
    .index("by_email_list", ["email", "list"])
    .index("by_list", ["list"]),
});
