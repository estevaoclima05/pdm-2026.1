import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

import Animated, {
  measure,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedRef,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

type ZoneType = "gosto" | "naoGosto";

interface DraggableItemProps {
  item: string;

  naoGostoZoneRef: AnimatedRef<any>;
  gostoZoneRef: AnimatedRef<any>;

  onDropped: (
    item: string,
    zone: ZoneType,
  ) => void;

  onReturnedToOrigin?: (
    item: string,
  ) => void;
}

export interface DraggableItemRef {
  resetPosition: () => void;
}

const DraggableItem = forwardRef<
  DraggableItemRef,
  DraggableItemProps
>(function DraggableItem(
  {
    item,
    naoGostoZoneRef,
    gostoZoneRef,
    onDropped,
    onReturnedToOrigin,
  },
  ref,
) {
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);

  const itemRef = useRef<View>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      itemRef.current?.measure(
        (
          _fx,
          _fy,
          width,
          height,
          px,
          py,
        ) => {
          initialX.value =
            px + width / 2;

          initialY.value =
            py + height / 2;
        },
      );
    }, 500);

    return () =>
      clearTimeout(timeoutId);
  }, []);

  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      translateX.value =
        withSpring(
          0,
          SPRING_CONFIG,
        );

      translateY.value =
        withSpring(
          0,
          SPRING_CONFIG,
        );
    },
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(
        1.05,
        SPRING_CONFIG,
      );
    })

    .onUpdate((event) => {
      translateX.value =
        event.translationX;

      translateY.value =
        event.translationY;
    })

    .onEnd((event) => {
      scale.value = withSpring(
        1,
        SPRING_CONFIG,
      );

      const finalX =
        initialX.value +
        event.translationX;

      const finalY =
        initialY.value +
        event.translationY;

      const naoGosto =
        measure(naoGostoZoneRef);

      const gosto =
        measure(gostoZoneRef);

      if (
        naoGosto &&
        finalX >= naoGosto.pageX &&
        finalX <=
          naoGosto.pageX +
            naoGosto.width &&
        finalY >= naoGosto.pageY &&
        finalY <=
          naoGosto.pageY +
            naoGosto.height
      ) {
        translateX.value =
          withSpring(
            naoGosto.pageX +
              naoGosto.width / 2 -
              initialX.value,
            SPRING_CONFIG,
          );

        translateY.value =
          withSpring(
            naoGosto.pageY +
              naoGosto.height /
                2 -
              initialY.value,
            SPRING_CONFIG,
          );

        runOnJS(onDropped)(
          item,
          "naoGosto",
        );

        return;
      }

      if (
        gosto &&
        finalX >= gosto.pageX &&
        finalX <=
          gosto.pageX + gosto.width &&
        finalY >= gosto.pageY &&
        finalY <=
          gosto.pageY +
            gosto.height
      ) {
        translateX.value =
          withSpring(
            gosto.pageX +
              gosto.width / 2 -
              initialX.value,
            SPRING_CONFIG,
          );

        translateY.value =
          withSpring(
            gosto.pageY +
              gosto.height / 2 -
              initialY.value,
            SPRING_CONFIG,
          );

        runOnJS(onDropped)(
          item,
          "gosto",
        );

        return;
      }

      translateX.value =
        withSpring(
          0,
          SPRING_CONFIG,
        );

      translateY.value =
        withSpring(
          0,
          SPRING_CONFIG,
        );

      if (onReturnedToOrigin) {
        runOnJS(
          onReturnedToOrigin,
        )(item);
      }
    });

  const animatedStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            translateX.value,
        },

        {
          translateY:
            translateY.value,
        },

        {
          scale: scale.value,
        },
      ],
    }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={itemRef}
        style={[
          styles.card,
          animatedStyle,
        ]}
      >
        <Text style={styles.cardText}>
          {item}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 25,

    backgroundColor: "#6366F1",

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    margin: 8,

    shadowColor: "#4338CA",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.22,
    shadowRadius: 10,

    elevation: 8,

    zIndex: 5,
  },

  cardText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.3,
    textAlign: "center",
  },
});

export default DraggableItem;