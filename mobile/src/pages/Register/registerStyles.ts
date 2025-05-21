import { StyleSheet } from "react-native";

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    marginHorizontal: 10,
  },
  view: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "87%",
  },
  title: {
    fontSize: 32,
    color: "#000000",
    fontWeight: "bold",
    marginVertical: 5,
    paddingTop: 20,
    width: "100%",
    textAlign: "left",
    justifyContent: "flex-start",
    fontFamily: "BebasNeue-Regular",
  },
  subtitle: {
    fontSize: 16,
    alignContent: "flex-start",
    width: "80%",
    fontFamily: "DMSans-Regular",
  },
});
