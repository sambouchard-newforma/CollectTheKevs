import Matter from "matter-js";

import {windowHeight, windowWidth} from "@game";
import Chicken from "./Chicken";
import Wall from "./Wall";
import {GameEngineEntities, Position2D, Size2D} from "@types";
import Keven from "./Keven";

export function entities(): GameEngineEntities {
  const engine = Matter.Engine.create({
    enableSleeping: false,
    gravity: { x: 0, y: 1.75 },
  } as Matter.IEngineDefinition);

  const world = engine.world;
  const [top, bottom] = [
    global.topInset,
    global.bottomInset,
    global.leftInset,
    global.rightInset,
  ];

  const chickenPositionX = Math.random() * (windowWidth - 100) + 50
  const chickenPositionY =  windowHeight - top - 100

  const newChicken = () =>
    Chicken(
      "Chicken",
      world,
      {
        x: chickenPositionX,
        y: chickenPositionY, // Start at the bottom
      },
      { width: 40, height: 50 }
    );


  const newPlatform = (label: string,pos: Position2D, size: Size2D) => {
    return Wall(
        label,
        world,
        'blue',
        pos,
        size
    )
  }
  const platforms = []
  let prevY = chickenPositionY;
  for (let i = 0; i < 4; i++) {
    platforms[i] = newPlatform(
        `Platform${i}`,
        {x: Math.random() * (windowWidth - 100) + 50, y: prevY - 150},
        {height: 20, width: 400}
    )
    prevY -= 150;
  }

  const entities = {
    physics: { engine, world },
    Chicken: newChicken(),
    LeftWall: Wall(
      "LeftWall",
      world,
      "orange",
      { x: 0 - 25, y: windowHeight / 2 },
      { height: windowHeight - topInset - bottomInset + 560, width: 50 }
    ),
    RightWall: Wall(
      "RightWall",
      world,
      "orange",
      { x: windowWidth + 25, y: windowHeight / 2 },
      { height: windowHeight - topInset - bottomInset + 560, width: 50 }
    ),
    Floor: Wall(
      "Floor",
      world,
      "orange",
      { x: windowWidth / 2, y: windowHeight - top },
      { height: 60 + bottom, width: windowWidth }
    ),
    Keven: Keven(
        'Keven',
        world,
        { x: platforms[0].pos.x, y: platforms[0].pos.y - 70 },
        { width: 10, height: 70 }
    ),
    Platform1: platforms[0],
    Platform2: platforms[1],
    Platform3: platforms[2],
    Platform4: platforms[3],
  };

  Matter.Events.on(
    engine,
    "collisionStart",
    ({ pairs }: Matter.IEventCollision<object>) => {
      for (let i = 0, j = pairs.length; i != j; ++i) {
        const bodyA = pairs[i].bodyA;

        console.log('bodyA:', bodyA.label)
        const bodyB = pairs[i].bodyB;
        console.log('bodyB:', bodyB.label)


        // We only want collisions between the balloon and the floor
        if (
          (bodyA.label == "Keven" && bodyB.label == "Chicken") ||
          (bodyA.label == "Chicken" && bodyB.label == "Keven")
        ) {
          console.log("Collision detected between Chicken and Keven!");
          const kevenBody = entities.Keven.body;

          // Remove balloon if it hits the floor
          Matter.World.remove(world, kevenBody, true);

          // Add new Keven

          const random = Math.floor(Math.random() * platforms.length);
          entities.Keven = Keven(
              'Keven',
              world,
              {x: platforms[random].pos.x, y: platforms[random].pos.y - 70},
              {width: 10, height: 70}
          );
          // @ts-expect-error, for some reason this doesn't work if passed as entities.Balloon.body
          Matter.World.add(world, entities.Keven);

          // Add a point from the score
          const gameEngine = global.gameEngine!;
          gameEngine.dispatch({
            type: "addToScore",
          });
        }
      }
    }
  );

  return entities;
}

