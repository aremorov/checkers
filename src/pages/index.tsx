import React, { FC, ReactNode, useState } from "react";

const blueButtonStyle =
  "bg-blue-600 text-white py-1 px-4 rounded-md uppercase hover:bg-blue-800";

type NumOutProps = {
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
  <div className="aspect-square w-5 rounded-full bg-yellow-500" />
);

const GreenPiece = () => (
  <div className="aspect-square w-5 rounded-full bg-green-400" />
);

const num64: number[] = [];

for (let i = 1; i < 65; i++) {
  num64.push(i);
}

type Piece = {
  position: number;
  color: "green" | "yellow";
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

const menuButton = () => {
  alert("Menu");
};

const idButton = () => {
  alert("ID");
};

const HomePage = () => {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);

  const [selected, setSelected] = useState<Piece | null>(null);

  const [ccolor, setCcolor] = useState<string>("yellow");

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
      <div className="grid max-h-full w-[300px] max-w-full grid-cols-8 overflow-hidden rounded-lg border-4 border-red-500">
        {listItems}
      </div>
      <div className="flex items-center gap-2 p-4">
        <button className={blueButtonStyle} type="button" onClick={menuButton}>
          Menu
        </button>
        <button className={blueButtonStyle} type="button" onClick={idButton}>
          game id
        </button>
      </div>
    </div>
  );
};

export default HomePage;
