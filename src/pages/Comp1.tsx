import React from "react";

const Comp1 = () => (
  <div className="border-[12px] border-blue-500"> Hello world</div>
);

const sum = (a: number, b: number) => a + b;

const Comp2 = () => (
  <div className="border-[2px] border-blue-500">
    {" "}
    <h2>It is.</h2>
  </div>
);

// const Submission = () => (
//   <div>
//     ASDALSI
//     <form>
//       <label>
//         NAME NAME NAME NAME:
//         <input type="text" name="name" />
//       </label>
//       <input type="submit" value="Submit" />
//     </form>
//     <textarea>Hello there</textarea>
//   </div>
// );

// const Grid1 = () => (
//   <div className="h-6 bg-gray-500">
//     dark
//     <div className="h-6 bg-gray-300">
//       light
//       <div className="h-6 bg-gray-500">
//         dark
//         <div className="h-6 bg-gray-300">
//           light
//           <div className="h-6 bg-gray-500">
//             dark
//             <div className="h-6 bg-gray-300">
//               light
//               <div className="h-6 bg-gray-500">
//                 dark
//                 <div className="h-6 bg-gray-300">light</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

const numbers = [1, 2, 3, 4, 5, 6];

const Grid1 = () => (
  <>
    <div className="grid grid-cols-4 gap-4">
      <div className="border-[12px] border-blue-500">01</div>
      <div>02</div>
      <div>03</div>
      <div>04</div>
      <div>05</div>
      <div>06</div>
    </div>
    {/* const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((number) =>
    <li>{number}</li>
    ); */}
  </>
);

const Submission = () => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  return (
    <div>
      {" "}
      <input value={inputValue} onChange={handleChange} />
    </div>
  );
};

// type UnitSquare = {
//   color: string; //either "w" or "b", white or black square
// };

//DESIGN 64 cell grid
//const cells: Piece[][];

//const Square = () => <div className="h-8 w-8"></div>;

export { Comp1 };

export { Comp2 };

export { sum };

export { Submission };

export { Grid1 };
