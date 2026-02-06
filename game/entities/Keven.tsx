import React, {useEffect} from 'react'
import Matter from 'matter-js'
import { View, Image } from 'react-native'

import { GameEntity, Position2D, Size2D } from '@types'
import {entities} from "./entities";

const Keven = ({ body }: GameEntity) => {
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
            <Image source={require('assets/SVG/Keven.gif')} />
        </View>
    );
};

export default (
    label: string,
    world: Matter.Composite,
    pos: Position2D,
    size: Size2D
) => {
    const kevenBody = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label,
            isStatic: true
        } as Matter.IChamferableBodyDefinition
    )
    Matter.Composite.add(world, kevenBody);

    return {
        body: kevenBody,
        pos,
        renderer: Keven,
    };
};
