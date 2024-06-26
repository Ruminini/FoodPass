import { TouchableOpacity, StyleSheet, Alert, BackHandler, Dimensions } from "react-native";
import React, { useEffect } from "react";
import ArrowLeft from "../assets/svg/arrow-left.svg";

const size = Dimensions.get('window').height / 15;

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
      <ArrowLeft width={size} height={size} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 15,
    position: "absolute",
  },
});
