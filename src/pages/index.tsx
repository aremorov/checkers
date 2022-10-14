import React, { FC, ReactNode, useState } from "react";

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
  <div className="aspect-square w-10 rounded-full bg-yellow-400" />
);

const GreenPiece = () => (
  <div className="aspect-square w-10 rounded-full bg-green-400" />
);

const num64: number[] = [];

for (let i = 1; i < 65; i++) {
  num64.push(i);
}

type Piece = {
  position: number;
  color: "green" | "yellow";
};

const HomePage = () => {
  const [pieces, setPieces] = useState<Piece[]>([
    { position: 10, color: "green" },
    { position: 15, color: "green" },
    { position: 43, color: "green" },
    { position: 13, color: "yellow" },
    { position: 18, color: "yellow" },
    { position: 38, color: "yellow" },
  ]);
  const [selected, setSelected] = useState<number | null>(null);

  const handleClickMaker = (index: number) => () => {
    if (selected === null && pieces.some((piece) => piece.position === index)) {
      setSelected(index);
    } else if (selected !== null) {
      if (
        !pieces.some((piece) => piece.position === index) &&
        (((index - 1) % 16 < 8 && index % 2 === 0) ||
          (index % 16 > 8 && index % 2 === 1)) &&
        Math.abs(selected - index) < 11 &&
        Math.abs(selected - index) > 2
      ) {
        console.log("move");
        console.log(pieces[selected]?.color);
        console.log(pieces[index]?.color);
        console.log(pieces);
        console.log(selected);
        console.log(index);
        setPieces([
          {
            position: index,
            color:
              pieces.find((piece) => piece.position === selected)?.color ??
              "yellow",
          },
          ...pieces.filter((piece) => piece.position !== selected),
        ]);
      }
      setSelected(null);
    }
  };

  const listItems = num64.map((i) => (
    <NumOut
      key={i}
      i={i}
      selected={selected === i}
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
    <div>
      {/* <Grid1 /> */}
      <div className="grid grid-cols-8">{listItems}</div>
    </div>
  );
};

// const B = (x, y) => {
//   ...logic...

//   return(...stuff...)
// }

export default HomePage;
