import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { normalizeImageUrl } from "../../../utils/normalizeImageUrl";

interface PreferencesCardProps {
  preference: {
    typeId: string;
    typeName: string;
    typeDescription: string;
    image: string;
    name: string;
  };
  style?: ViewStyle;
  onPress?: () => void;
  isSelected?: () => boolean;
}

export default function PreferencesCard({
  preference,
  onPress,
  style,
}: PreferencesCardProps) {
  const imageURL = normalizeImageUrl(preference.image);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.imageContainer, style]}>
          <Image source={{ uri: imageURL }} style={styles.image} />
        </View>
        <Text style={styles.text}>{preference.name}</Text>
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
    width: 100,
    height: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    fontFamily: "DMSans-Bold",
  },
});
