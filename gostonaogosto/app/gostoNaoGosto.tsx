import DraggableItem, {
  type DraggableItemRef,
} from "@/components/DraggableItem";

import {
  useRef,
  useState,
} from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAnimatedRef } from "react-native-reanimated";

type ZoneType =
  | "gosto"
  | "naoGosto"
  | null;

export default function GostoNaoGosto() {
  const items = [
    "Brócolis",
    "Pizza",
    "Chuva",
    "Praia",
    "Segunda",
    "Férias",
  ];

  const [itemZones, setItemZones] =
    useState<Record<string, ZoneType>>(
      Object.fromEntries(
        items.map((i) => [i, null]),
      ),
    );

  const itemRefs = useRef<
    Record<
      string,
      DraggableItemRef | null
    >
  >({});

  const naoGostoZoneRef =
    useAnimatedRef<View>();

  const gostoZoneRef =
    useAnimatedRef<View>();

  const handleDropped = (
    item: string,
    zone: ZoneType,
  ) => {
    setItemZones((prev) => ({
      ...prev,
      [item]: zone,
    }));
  };

  const handleRemove = (
    item: string,
  ) => {
    setItemZones((prev) => ({
      ...prev,
      [item]: null,
    }));

    itemRefs.current[
      item
    ]?.resetPosition();
  };

  const handleReturnedToOrigin = (
    item: string,
  ) => {
    setItemZones((prev) => ({
      ...prev,
      [item]: null,
    }));
  };

  const gostoItems = items.filter(
    (i) => itemZones[i] === "gosto",
  );

  const naoGostoItems =
    items.filter(
      (i) =>
        itemZones[i] ===
        "naoGosto",
    );

  return (
    <GestureHandlerRootView
      style={styles.root}
    >
      <SafeAreaView
        style={styles.safeArea}
        edges={[
          "top",
          "bottom",
          "left",
          "right",
        ]}
      >
        <Text style={styles.title}>
          Arraste para Gosto ou Não
          Gosto
        </Text>

        <View style={styles.dragArea}>
          {items.map((item) => (
            <DraggableItem
              key={item}
              item={item}
              naoGostoZoneRef={
                naoGostoZoneRef
              }
              gostoZoneRef={
                gostoZoneRef
              }
              onDropped={
                handleDropped
              }
              onReturnedToOrigin={
                handleReturnedToOrigin
              }
              ref={(r) => {
                itemRefs.current[
                  item
                ] = r;
              }}
            />
          ))}
        </View>

        <View style={styles.dropZones}>
          <View
            ref={naoGostoZoneRef}
            style={[
              styles.dropZone,
              styles.naoGostoZone,
            ]}
          >
            <Text style={styles.zoneTitle}>
              👎 Não Gosto
            </Text>

            {naoGostoItems.map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  handleRemove(i)
                }
              >
                <Text
                  style={
                    styles.droppedItem
                  }
                >
                  {i} ✕
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            ref={gostoZoneRef}
            style={[
              styles.dropZone,
              styles.gostoZone,
            ]}
          >
            <Text style={styles.zoneTitle}>
              👍 Gosto
            </Text>

            {gostoItems.map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  handleRemove(i)
                }
              >
                <Text
                  style={
                    styles.droppedItem
                  }
                >
                  {i} ✕
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  safeArea: {
    flex: 1,
    paddingTop: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
    color: "#1E293B",
    letterSpacing: 0.3,
  },

  dragArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
    zIndex: 10,
  },

  dropZones: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  dropZone: {
    flex: 1,
    borderRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 14,
    minHeight: 220,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  naoGostoZone: {
    backgroundColor: "#FFE2E2",
    borderWidth: 2,
    borderColor: "#FFCACA",
  },

  gostoZone: {
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: "#BBF7D0",
  },

  zoneTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
    color: "#334155",
  },

  droppedItem: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",

    backgroundColor: "rgba(255,255,255,0.75)",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 14,

    marginTop: 8,

    overflow: "hidden",

    minWidth: 100,
    textAlign: "center",
  },
});