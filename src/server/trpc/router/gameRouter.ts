import { t } from "../trpc";
import { z } from "zod";

type Piece = {
  position: number;
  color: "green" | "yellow";
};

type CurrentColor = "yellow" | "green";

type GameStateObject = {
  pieces: Piece[];
  ccolor: CurrentColor;
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
  ccolor: "yellow",
};

export const gameRouter = t.router({
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

  updateGameState: t.procedure
    .input(z.object({ id: z.string(), gameState: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, gameState } = input;

      const game = await ctx.prisma.gameState.update({
        where: {
          id,
        },
        data: {
          game_state: gameState,
        },
      });

      const newGameState = JSON.parse(game.game_state);
      return newGameState as GameStateObject;
    }),
});

// https://www.prisma.io/docs/concepts/components/prisma-client

// index.tsx => blahblah.vercel.app/
// /game/[gameId].tsx => blahblah.vercel.app/game/sa09f89032f09-32-0f9wer

//two functions: load game (grab game from database), update game: move down from frontend, validate, return new game state, update database
