import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WorkoutsProvider } from "../context/WorkoutsContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WorkoutsProvider>
        <SafeAreaView style={styles.safeArea}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#25292e" },
              headerTintColor: "#fff",
            }}
          />
        </SafeAreaView>
      </WorkoutsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#25292e",
  },
});
