import { useState }     from "react";
import { SetupScreen }  from "./components/SetupScreen";
import { BoardScreen }  from "./components/BoardScreen";
import { useConfigs }   from "./hooks/useConfigs";
import { base }         from "./styles/index.js";

export default function App() {
  const [game, setGame] = useState(null);
  const { configs, ready, save, remove } = useConfigs();

  if (!ready) {
    return (
      <div style={{ ...base.screen, justifyContent: "center" }}>
        <div style={base.logo}>MURDOKU</div>
      </div>
    );
  }

  if (game) {
    return (
      <BoardScreen
        rows={game.rows}
        cols={game.cols}
        suspects={game.suspects}
        numRooms={game.numRooms}
        range={game.range}
        initialRoomLayout={game.roomLayout}
        initialCellState={game.cellState}
        onBack={() => setGame(null)}
        onSaveConfig={save}
      />
    );
  }

  return (
    <SetupScreen
      configs={configs}
      onDeleteConfig={remove}
      onPlay={(cfg) => setGame(cfg)}
    />
  );
}
