import React, {useEffect} from 'react'
import Matter from 'matter-js'
import { View, Image } from 'react-native'

import { GameEntity, Position2D, Size2D } from '@types'
import {entities} from "./entities";

const Chicken = ({ body }: GameEntity) => {
  const heightBody = body.bounds.max.y - body.bounds.min.y;
  const widthBody = body.bounds.max.x - body.bounds.min.x;

  const xBody = body.position.x - widthBody / 2;
  const yBody = body.position.y - heightBody / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: xBody,
        top: yBody,
        width: widthBody,
        height: heightBody,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image source={require('assets/SVG/ChickenWalk.gif')} />
    </View>
  );
};

export default (
  label: string,
  world: Matter.Composite,
  pos: Position2D,
  size: Size2D
) => {
  const chickenBody = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label,
    isStatic: false,
    id: 5,
  });
  Matter.Composite.add(world, chickenBody);
    document.addEventListener('keydown', function(event) {
        const speed = 5;
        if (event.key === 'w') Matter.Body.setVelocity(chickenBody, { x: 0, y: -speed * 2 });
        if (event.key === 'a') Matter.Body.setVelocity(chickenBody, { x: -speed, y: 0 });
        if (event.key === 'd') Matter.Body.setVelocity(chickenBody, { x: speed, y: 0 });
    });

  return {
    body: chickenBody,
    pos,
    renderer: Chicken,
  };
};
