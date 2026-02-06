import { GameEngineEntities, GameEntity } from "@types";
import Matter from "matter-js";
import {
  GameEngineUpdateEventOptionType,
  TouchEvent,
} from "react-native-game-engine";

interface WebInputEvent {
  name: string;
  payload: {
    clientX: number;
    clientY: number;
  };
}


export const GameLoop = (
  entities: GameEngineEntities,
  { touches, input, time, dispatch }: GameEngineUpdateEventOptionType & { input?: WebInputEvent[] }
) => {
  const engine = entities.physics.engine;

    // Handle web input (mouse clicks)
  if (input) {
    input
      .filter((i: WebInputEvent) => i.name === "onClick")
      .forEach((i: WebInputEvent) => {
        const balloonBody = (entities.Chicken as GameEntity).body;
        const balloonPos = balloonBody.position as Matter.Vector;

        // Use clientX/Y for web mouse coordinates
        const x = i.payload.clientX;
        const y = i.payload.clientY;

        if (
          Math.abs(x - balloonPos.x) < 100 &&
          Math.abs(y - balloonPos.y) < 100
        ) {
          dispatch({
            type: "addToScore",
          });
          Matter.Events.trigger(engine, "removeBalloon");
        }
      });
  }

  Matter.Engine.update(engine, time.delta);
  return entities;
};
