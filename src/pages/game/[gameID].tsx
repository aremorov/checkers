import { useRouter } from "next/router";
import React, { FC, ReactNode, useEffect, useState, useRef } from "react";
import { trpc } from "../../utils/trpc";

const blueButtonStyle =
  "disabled:bg-slate-400 bg-blue-600 text-white py-1 px-4 rounded-md uppercase hover:bg-blue-800";

type NumOutProps = {
  //RENAME
  i: number;
  selected: boolean;
  handleClick: () => void;
  children?: ReactNode;
};

const NumOut: FC<NumOutProps> = ({ i, selected, handleClick, children }) => {
  const isBlack =
    ((i - 1) % 16 < 8 && i % 2 === 0) || (i % 16 > 8 && i % 2 === 1);

  return (
    <div
      onClick={handleClick}
      className={`pointer flex aspect-square items-center justify-center ${
        isBlack ? "bg-black" : "bg-white"
      } ${selected ? "border-4 border-red-500" : ""}`}
    >
      {children}
    </div>
  );
};

const YellowPiece = () => (
  <div className="aspect-square w-2/3 rounded-full bg-yellow-500" />
);

const GreenPiece = () => (
  <div className="aspect-square w-2/3 rounded-full bg-green-400" />
);

const num64: number[] = [];

for (let i = 1; i < 65; i++) {
  num64.push(i);
}

type Piece = {
  position: number;
  color: "green" | "yellow";
};

const menuButton = () => {
  alert("Menu");
};

const handleShare = () => {
  const gameLink = window.location.href;

  navigator.clipboard.writeText(gameLink);
};

const GamePage = () => {
  const { query } = useRouter();

  const gameStateQuery = trpc.game.getGameState.useQuery({
    id: query?.gameID as unknown as string,
  });

  const updateMutation = trpc.game.updateGameState.useMutation();

  const [pieces, setPieces] = useState<Piece[]>([]);

  const [selected, setSelected] = useState<Piece | null>(null);

  const [ccolor, setCcolor] = useState<string | null>(null);

  useEffect(() => {
    const syncPieces = () => {
      if (gameStateQuery.data) {
        setPieces(gameStateQuery.data.pieces);
        setCcolor(gameStateQuery.data.ccolor);
      }
    };
    syncPieces();
  }, [gameStateQuery.data]);

  const shouldUpdateRef = useRef(false);

  const updateGame = () => (shouldUpdateRef.current = true);

  useEffect(() => {
    if (shouldUpdateRef.current) {
      updateMutation.mutate({
        id: query?.gameID as unknown as string,
        gameState: JSON.stringify({ pieces, ccolor }),
      });
      shouldUpdateRef.current = false;
    }
  }, [shouldUpdateRef, updateMutation, ccolor, pieces, query?.gameID]);

  const handleClickMaker = (index: number) => () => {
    // Grab the piece, if any, on the cell for `index`
    const cellPiece = pieces.find((piece) => piece.position === index);

    // Handle selecting new piece
    if (selected === null && cellPiece && cellPiece.color === ccolor) {
      setSelected(cellPiece);
    }

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
        setPieces([
          {
            position: index,
            color: selected.color,
          },
          ...pieces.filter((piece) => piece.position !== selected.position),
        ]);
        ccolor === "yellow" ? setCcolor("green") : setCcolor("yellow");
        updateGame();
      }
      setSelected(null);
    }

    // Grab the piece that the selected piece would jump to, if any,
    const jumpserPiece = pieces.find(
      (piece) => selected && piece.position === 2 * index - selected.position
    );

    // Handle capturing enemy piece
    if (
      !jumpserPiece &&
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
      setPieces([
        {
          position: 2 * index - selected.position,
          color: selected.color,
        },
        ...pieces.filter(
          (piece) =>
            piece.position !== selected.position &&
            piece.position !== cellPiece.position
        ),
      ]);
      ccolor === "yellow" ? setCcolor("green") : setCcolor("yellow");
      updateGame();
    }
  };

  const listItems = num64.map((i) => (
    <NumOut
      key={i}
      i={i}
      selected={selected?.position === i}
      handleClick={handleClickMaker(i)}
    >
      {pieces.some((piece) => piece.position === i) &&
        (pieces.find((piece) => piece.position === i)?.color === "green" ? (
          <GreenPiece />
        ) : (
          <YellowPiece />
        ))}
    </NumOut>
  ));

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex items-center gap-2 p-6">
        <div
          className={`flex h-6 w-6 rounded ${
            ccolor === "yellow" ? "bg-yellow-500" : "bg-green-400"
          }`}
        />
        {`${ccolor}'s turn`}
      </div>
      <div className="grid aspect-square w-screen max-w-[75vh] grid-cols-8 overflow-hidden rounded-lg border-4 border-red-500">
        {listItems}
      </div>
      <div className="flex items-center gap-2 p-4">
        <button className={blueButtonStyle} type="button" onClick={menuButton}>
          Menu
        </button>
        <button className={blueButtonStyle} type="button" onClick={handleShare}>
          share game link
        </button>
      </div>
    </div>
  );
};

export default GamePage;
export { blueButtonStyle };
