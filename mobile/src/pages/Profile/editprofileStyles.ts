import { StyleSheet } from "react-native";

export const editprofileStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    marginHorizontal: 16,
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
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonPressed: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
});
