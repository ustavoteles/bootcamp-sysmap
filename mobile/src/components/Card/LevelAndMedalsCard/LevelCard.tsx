import { Medal } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";
import TrophyImage from "../../../../assets/trophies.svg";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppState";

export default function LevelCard() {
  const { auth } = useContext(AppContext);
  const [userLevel, setUserLevel] = useState("");
  const [userXp, setUserXP] = useState(Number);

  useEffect(() => {
    if (auth?.user) {
      const level = auth.user.level;
      setUserLevel(level);
    }
  }, [auth]);

  useEffect(() => {
    if (auth?.user) {
      const xp = auth.user.xp;
      setUserXP(xp);
    }
  }, [auth]);

  return (
    <View style={styles.container}>
      <View style={styles.core}>
        <View style={styles.levelInfo}>
          <Medal size={30} />
          <Text style={{ fontFamily: "DMSans-Bold", fontSize: 12 }}>
            Seu nível é
          </Text>
          <Text style={styles.leveltext}>{userLevel}</Text>
        </View>
        <TrophyImage />
      </View>
      <View style={styles.points}>
        <Text style={{ fontFamily: "DMSans-Regular" }}>
          Pontos para o próximo nível
        </Text>
        <Text style={{ fontFamily: "DMSans-Bold", fontSize: 15 }}>
          {userXp}/50 pts
        </Text>
      </View>
      <ProgressBar progress={userXp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 335,
    height: 190,
    backgroundColor: "#69696926",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  core: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  levelInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  points: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leveltext: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "DMSans-Bold",
  },
});
