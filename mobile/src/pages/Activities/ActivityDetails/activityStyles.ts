import { StyleSheet } from "react-native";

export const activityStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  banner: {
    height: 300,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    overflow: "hidden",
  },
  menu: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttomMenu: {
    flexDirection: "row",
  },
  title: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: "BebasNeue-Regular",
  },
  views: { gap: 5 },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  coordsText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    marginLeft: 4,
  },
});
