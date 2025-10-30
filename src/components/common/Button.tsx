import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Pressable } from "react-native";

interface ButtonProps {
  iconName?: ComponentProps<typeof Ionicons>["name"];
  iconSize?: number;
  onPress?: () => void;
}

export default function Button({
  iconName = "accessibility-outline",
  iconSize = 24,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      className={`rounded-full aspect-square items-center justify-center  bg-blue-400 w-[${
        iconSize + 16
      }px] h-[${iconSize + 16}px]`}
    >
      <Ionicons name={iconName} size={24} color={"#FFFFFF"} />
    </Pressable>
  );
}
