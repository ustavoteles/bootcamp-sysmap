import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 39,
    paddingTop: 10,
    width: "100%",
  },
  view: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 30,
    color: "#000000",
    fontWeight: "bold",
    marginVertical: 15,
    paddingTop: 10,
    width: "100%",
    textAlign: "center",
    flexShrink: 1,
    fontFamily: "BebasNeue-Regular",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "semibold",
    alignContent: "flex-start",
    width: "90%",
    marginBottom: 23,
    fontFamily: "DMSans-Regular",
  },
});
