import { View, StyleSheet } from "react-native";

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.1006)",

    borderRadius: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#000000",
  },
});
