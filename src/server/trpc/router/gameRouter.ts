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
  account1: string;
  account2: string;
};

type MoveObject = {
  position1: number;
  position2: number;
};

const ZMove = z.object({
  position1: z.number(),
  position2: z.number(),
});

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
  account1: "",
  account2: "",
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
      let game;
      if (id !== "") {
        game = await ctx.prisma.gameState.findFirstOrThrow({
          where: {
            id,
          },
        });
        const gameState = JSON.parse(game.game_state);
        return gameState as GameStateObject;
      }
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

  //update based on move provided:
  //need: color, original position, new position
  updateMove: t.procedure
    .input(z.object({ id: z.string(), move: ZMove }))
    .mutation(async ({ input, ctx }) => {
      const { id, move } = input;

      //check if move is valid:

      const { position1, position2 } = move;
      //gets game:
      const game = await ctx.prisma.gameState.findFirstOrThrow({
        where: {
          id,
        },
      });

      let gameState = JSON.parse(game.game_state) as GameStateObject;

      let { pieces, ccolor, account1, account2 } = gameState;

      const selected = pieces.find((piece) => piece.position === position1);

      const index = position2;

      const cellPiece = pieces.find((piece) => piece.position === index);

      let moved = false;

      // Handle moving to empty cell
      if (selected) {
        if (
          !cellPiece &&
          (((index - 1) % 16 < 8 && index % 2 === 0) ||
            (index % 16 > 8 && index % 2 === 1)) &&
          ((selected.color === "green" && index - selected.position === 7) ||
            index - selected.position === 9 ||
            (selected.color === "yellow" && index - selected.position === -7) ||
            index - selected.position === -9)
        ) {
          pieces = [
            {
              position: index,
              color: selected.color,
            },
            ...pieces.filter((piece) => piece.position !== selected.position),
          ];

          ccolor = ccolor === "yellow" ? "green" : "yellow";
          moved = true;
        }
      }

      //eating a piece:

      const jumpPiece = pieces.find(
        (piece) => selected && piece.position === 2 * index - selected.position
      );

      if (
        !jumpPiece &&
        selected &&
        cellPiece &&
        selected.color !== cellPiece.color &&
        cellPiece.position < 57 &&
        cellPiece.position > 8 &&
        cellPiece.position % 8 !== 1 &&
        cellPiece.position % 8 !== 0 &&
        (Math.abs(index - selected.position) === 7 ||
          Math.abs(index - selected.position) === 9)
      ) {
        pieces = [
          {
            position: 2 * index - selected.position,
            color: selected.color,
          },
          ...pieces.filter(
            (piece) =>
              piece.position !== selected.position &&
              piece.position !== cellPiece.position
          ),
        ];

        ccolor = ccolor === "yellow" ? "green" : "yellow";
        moved = true;
      }

      gameState = {
        pieces: pieces,
        ccolor: ccolor,
        account1: "",
        account2: "",
      };

      await ctx.prisma.gameState.update({
        where: {
          id,
        },
        data: {
          game_state: JSON.stringify(gameState),
        },
      });

      return moved;
    }),
});

// https://www.prisma.io/docs/concepts/components/prisma-client

// index.tsx => blahblah.vercel.app/
// /game/[gameId].tsx => blahblah.vercel.app/game/sa09f89032f09-32-0f9wer

//two functions: load game (grab game from database), update game: move down from frontend, validate, return new game state, update database
