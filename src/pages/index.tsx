import { useRouter } from "next/router";
import { blueButtonStyle } from "./game/[gameID]";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

const HomePage = () => {
  const newGameMutation = trpc.game.newGame.useMutation();

  const router = useRouter();

  const handleNewGame = () => {
    newGameMutation.mutate();
  };

  useEffect(() => {
    const gameId = newGameMutation.data;

    if (gameId) {
      router.push(`/game/${gameId}`);
    }
  }, [newGameMutation, router]);

  return (
    <div>
      <h1 className="text-5xl">Checler Sleven</h1>
      <button onClick={handleNewGame} className={blueButtonStyle}>
        New Game
      </button>
    </div>
  );
};

export default HomePage;
