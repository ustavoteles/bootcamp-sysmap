import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  text?: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  text = "Teste",
  onPress = () => console.log("Teste"),
  color = "#00BC7D",
  textColor = "white",
  fullWidth = false,
  disabled = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 10,
        borderRadius: 5,
        width: fullWidth ? "100%" : undefined,
        minWidth: 100,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{ color: textColor, fontFamily: "DMSans-Bold", fontSize: 16 }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
