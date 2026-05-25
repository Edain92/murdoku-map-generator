import { useState, useEffect } from "react";
import { loadConfigs, saveConfigs } from "../utils/storage";

export function useConfigs() {
  const [configs, setConfigs]   = useState([]);
  const [ready,   setReady]     = useState(false);

  useEffect(() => {
    loadConfigs().then((cfgs) => {
      setConfigs(cfgs);
      setReady(true);
    });
  }, []);

  const save = async (name, range, rows, cols, numRooms, cells, rooms) => {
    const roomsSerialized = rooms.map((rm) => ({
      id:      rm.id,
      color:   rm.color,
      cells:   Array.from(rm.cells),
      borders: rm.borders,
    }));
    const cellsSerialized = Object.fromEntries(
      Object.entries(cells).filter(([, v]) => v !== null)
    );
    const newCfg = {
      id: Date.now(),
      name,
      range,
      rows,
      cols,
      rooms:      numRooms,
      roomLayout: roomsSerialized,
      cellState:  cellsSerialized,
    };
    const updated = [...configs, newCfg];
    setConfigs(updated);
    await saveConfigs(updated);
  };

  const remove = async (id) => {
    const updated = configs.filter((c) => c.id !== id);
    setConfigs(updated);
    await saveConfigs(updated);
  };

  return { configs, ready, save, remove };
}
