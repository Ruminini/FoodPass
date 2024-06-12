import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function UserItem({
  name,
  id,
  inactive = false,
  onPress,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style, inactive && styles.inactiveStyle]}
      onPress={onPress}
      >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{id}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 15,
    width: "100%",
    backgroundColor: "white",
    elevation: 2,
  },
  inactiveStyle: {
    opacity: 0.3
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "black",
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#222",
    textAlign: "left",
  },
});
