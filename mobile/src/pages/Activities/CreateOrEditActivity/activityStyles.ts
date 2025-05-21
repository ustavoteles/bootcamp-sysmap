import { StyleSheet } from "react-native";

export const activityStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginHorizontal: 13,
    marginTop: 40,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "BebasNeue-Regular",
  },
  menu: {
    width: "80%",
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
  },
});
