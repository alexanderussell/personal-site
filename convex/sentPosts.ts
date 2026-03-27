import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const check = query({
  args: { slug: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sentPosts")
      .withIndex("by_slug_type", (q) =>
        q.eq("slug", args.slug).eq("type", args.type)
      )
      .first();
    return !!existing;
  },
});

export const record = mutation({
  args: { slug: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("sentPosts", {
      slug: args.slug,
      type: args.type,
    });
  },
});
