import { createTRPCRouter, publicProcedure } from "$/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const comicSchema = z.object({
  alt: z.string(),
  img: z.string().url(),
  title: z.string(),
});

export const appRouter = createTRPCRouter({
  getComicById: publicProcedure
    .input(
      z.object({
        id: z.number().positive().int().gte(1),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(`https://xkcd.com/${input.id}/info.0.json`);

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch comic",
        });
      }

      const json: unknown = await response.json();

      return comicSchema.parse(json);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
