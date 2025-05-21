import { FlatList, StyleSheet, Text, View } from "react-native";
import MedalImage from "../../../../assets/medal.svg";
import { useEffect, useState } from "react";
import useAppContext from "../../../hooks/useAppContext";

interface Achievement {
  name: string;
  criterion: string;
}

export default function MedalCard() {
  const { auth } = useAppContext();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (Array.isArray(auth?.user?.achievements)) {
      setAchievements(auth.user.achievements);
    }
  }, [auth]);

  return (
    <View style={styles.container}>
      {achievements.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma medalha conquistada ainda.</Text>
      ) : (
        <FlatList
          data={achievements}
          numColumns={2}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={{ alignItems: "center", gap: 20 }}
          renderItem={({ item }) => (
            <View style={styles.medalCard}>
              <View style={styles.content}>
                <MedalImage width={69} height={94} />
              </View>
              <Text style={styles.achievementName}>
                {item.name || "Sem nome"}
              </Text>
              <Text style={styles.descriptionText}>
                {item.criterion || "Sem descrição"}
              </Text>
            </View>
          )}
        />
      )}
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
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  medalCard: {
    width: 140,
    height: 150,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  content: {
    width: 110,
    height: 110,
    backgroundColor: "#D9D9D9",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementName: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "DMSans-Bold",
    textAlign: "center",
    width: 100,
  },
  descriptionText: {
    fontSize: 12,
    textAlign: "center",
    width: 100,
    fontFamily: "DMSans-Regular",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "DMSans-Regular",
    textAlign: "center",
  },
});
