import { Dimensions, Text } from "react-native";
import { ScrollView, View } from "react-native";
import LevelCard from "./LevelCard";
import MedalCard from "./MedalCard";

export default function LevelAndMedalsScrollView() {
  return (
    <View style={{}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            margin: 10,
          }}
        >
          <LevelCard />
          <MedalCard />
        </View>
      </ScrollView>
    </View>
  );
}
