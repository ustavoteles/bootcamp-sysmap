import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "#00BC7D",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  menu: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 32,
    fontFamily: "BebasNeue-Regular",
  },
  buttomMenu: {
    flexDirection: "row",
    gap: 7,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "BebasNeue-Regular",
  },
  profile: {
    marginTop: 5,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 10,
  },
});
