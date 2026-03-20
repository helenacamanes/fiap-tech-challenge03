import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Tela de perfil</Text>
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
