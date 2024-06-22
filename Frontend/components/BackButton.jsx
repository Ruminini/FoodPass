import { TouchableOpacity, StyleSheet, Alert, BackHandler } from "react-native";
import React, { useEffect } from "react";
import ArrowLeft from "../assets/svg/arrow-left.svg";

export default function BackButton({ onPress, style, ignoreBack = false }) {
  useEffect(() => {
    if (ignoreBack) return;
    const backAction = () => {
      onPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <ArrowLeft width={50} height={50} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 5,
    position: "absolute",
  },
});
