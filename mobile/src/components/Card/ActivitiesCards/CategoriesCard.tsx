import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { API_URL } from "@env";
import { normalizeImageUrl } from "../../../utils/normalizeImageUrl";

interface CategoriesCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  style?: ViewStyle;
  onPress?: () => void;
}

export default function CategoriesCard({
  category,
  onPress,
  style,
}: CategoriesCardProps) {
  const imageURL = normalizeImageUrl(category.image);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.imageContainer, style]}>
          <Image source={{ uri: imageURL }} style={styles.image} />
        </View>
        <Text style={styles.text}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignSelf: "center",
    borderRadius: 30,
    paddingVertical: 2,
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 3,
    width: 70,
    height: 70,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "DMSans-Bold",
  },
});
