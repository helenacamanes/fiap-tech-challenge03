import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme";

export default function Goals() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Tela de metas</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.text,
    fontSize: 18,
  },
});
