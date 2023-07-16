/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Floor from './floor.png'

function App(): JSX.Element {
  const scale: any = useRef(new Animated.Value(0.15)).current;
  const lastScale: any = useRef(new Animated.Value(0.15)).current;
  const windowWidth = Dimensions.get('window').width;
  //diagonal of map
  const diagonal = Math.sqrt(Math.pow(450, 2) + Math.pow(windowWidth - 32, 2));

  //x and y coordinates for pan gesture
  const pan: any = useRef(new Animated.ValueXY({x: -150, y: -1550})).current;
  const panOffset: any = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const lastMove = useRef({x: 0, y: 0});

  //lenth from two fingers to center
  const lengthFromCenter = useRef(0);

  const lastPan: any = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  const calculatePinchValues = (touches: any) => {
    const x1 = Math.min(touches[0].pageX, touches[1].pageX);
    const y1 = Math.min(touches[0].pageY, touches[1].pageY);
    const x2 = Math.max(touches[0].pageX, touches[1].pageX);
    const y2 = Math.max(touches[0].pageY, touches[1].pageY);
    return {
      x1,
      y1,
      x2,
      y2,
    };
  };

  const calculateScale = (x1: any, y1: any, x2: any, y2: any) => {
    const Distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const currentDistance = Distance - lengthFromCenter.current;
    const deltaScale = 1 + currentDistance / diagonal;
    const newScale = lastScale._value * deltaScale;

    //offset for zoom but it dont work correctly
    //const translateX = pan.x._value * (newScale / 10 + 1) - pan.x._value;
    //const translateY = pan.y._value * (newScale / 10 + 1) - pan.y._value;

    //panOffset.x.setValue(translateX);
    //panOffset.y.setValue(translateY);

    return newScale;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        const touches = event.nativeEvent.touches;
        if (touches.length >= 2) {
          const {x1, y1, x2, y2} = calculatePinchValues(touches);
          let centerLenth = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
          );
          lengthFromCenter.current = centerLenth;
        }
      },
      onPanResponderMove: (event, gesture) => {
        const touches = event.nativeEvent.touches;
        if (touches.length >= 2) {
          const {x1, y1, x2, y2} = calculatePinchValues(touches);
          scale.setValue(calculateScale(x1, y1, x2, y2));
        } else {
          const dx = gesture.dx - lastMove.current.x;
          const dy = gesture.dy - lastMove.current.y;
          pan.x.setValue(pan.x._value + dx);
          pan.y.setValue(pan.y._value + dy);
          lastMove.current = {x: gesture.dx, y: gesture.dy};
        }
      },
      onPanResponderRelease: (event, gesture) => {
        lastMove.current = {x: 0, y: 0};
        lastScale.setValue(scale._value);
        lastPan.x.setValue(panOffset.x._value);
        lastPan.y.setValue(panOffset.y._value);
      },
    }),
  ).current;

  const handleDetectRoom = (event: any) => {
    // const {locationX, locationY} = event.nativeEvent;
    // for (const room of item.rooms_info) {
    //   if (
    //     locationX >= room.area_x1 &&
    //     locationX <= room.area_x2 &&
    //     locationY >= room.area_y1 &&
    //     locationY <= room.area_y2
    //   ) {
    //     console.log('room');
    //     return;
    //   }
    // }
  };

  return (
    <SafeAreaView style={{margin: 16}}>
      <View style={styles.mapContainer}>
         <Animated.View
      style={{
        transform: [
          {translateX: Animated.add(pan.x, panOffset.x)},
          {translateY: Animated.add(pan.y, panOffset.y)},
          {scale: scale},
        ],
      }}
      {...panResponder.panHandlers}
      collapsable={false}>
      <TouchableWithoutFeedback onPress={handleDetectRoom}>
        <Image
          source={Floor}
          style={{
            width: 4019,
            height: 3486,
          }}
        /> 
      </TouchableWithoutFeedback>
    </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    overflow: 'hidden',
    marginTop: 13,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 10,
    height: 600,
  },
});

export default App;
