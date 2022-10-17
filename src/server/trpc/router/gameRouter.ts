import { t } from "../trpc";
import { z } from "zod";

type Piece = {
  position: number;
  color: "green" | "yellow";
};

type GameStateObject = {
  pieces: Piece[];
};

const initialPieces: Piece[] = [];

for (let i = 1; i < 65; i++) {
  if (
    i < 25 &&
    (((i - 1) % 16 < 8 && i % 2 === 0) || (i % 16 > 8 && i % 2 === 1))
  ) {
    initialPieces.push({ position: i, color: "green" });
  } else if (
    i > 40 &&
    (((i - 1) % 16 < 8 && i % 2 === 0) || (i % 16 > 8 && i % 2 === 1))
  ) {
    initialPieces.push({ position: i, color: "yellow" });
  }
}

const initialGameState: GameStateObject = {
  pieces: initialPieces,
};

export const gameRouter = t.router({
  //   hello: t.procedure
  //     .input(z.object({ text: z.string().nullish() }).nullish())
  //     .query(({ input }) => {
  //       return {
  //         greeting: `Hello ${input?.text ?? "world"}`,
  //       };
  //     }),

  //   getAll: t.procedure.query(({ ctx }) => {
  //     return ctx.prisma.example.findMany();
  //   }),

  newGame: t.procedure.mutation(async ({ ctx }) => {
    const game = await ctx.prisma.gameState.create({
      data: {
        game_state: JSON.stringify(initialGameState),
      },
    });

    return game.id;
  }),

  getGameState: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const game = await ctx.prisma.gameState.findFirstOrThrow({
        where: {
          id,
        },
      });

      const gameState = JSON.parse(game.game_state);
      return gameState as GameStateObject;
    }),

  //   updateGameState: t.procedure
  //     // .input({ ...move input...  })
  //     //.query(({ input, ctx }) => {
  //         // Validate the move is fair

  //         // Update the game state object

  //         // Update the database entry

  //         // Return the object
  //     })
});

// https://www.prisma.io/docs/concepts/components/prisma-client

// index.tsx => blahblah.vercel.app/
// /game/[gameId].tsx => blahblah.vercel.app/game/sa09f89032f09-32-0f9wer

//two functions: load game (grab game from database), update game: move down from frontend, validate, return new game state, update database
