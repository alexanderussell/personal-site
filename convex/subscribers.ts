import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
  args: {
    email: v.string(),
    list: v.union(v.literal("book"), v.literal("newsletter")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email_list", (q) =>
        q.eq("email", args.email).eq("list", args.list)
      )
      .first();

    if (existing) {
      return { status: "already_subscribed" as const };
    }

    await ctx.db.insert("subscribers", {
      email: args.email,
      list: args.list,
    });

    return { status: "subscribed" as const };
  },
});
