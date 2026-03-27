import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("moods")
      .order("desc")
      .take(200);
  },
});

export const add = mutation({
  args: {
    mood: v.string(),
    album: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("moods", {
      mood: args.mood,
      album: args.album,
    });
    return { ok: true };
  },
});
