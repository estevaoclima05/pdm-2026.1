import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";

export interface DropZoneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropZonesContextType {
  gostoBounds: SharedValue<DropZoneBounds | null>;
  naoGostoBounds: SharedValue<DropZoneBounds | null>;
}

export const DropZonesContext = createContext<DropZonesContextType>(
  {} as DropZonesContextType
);