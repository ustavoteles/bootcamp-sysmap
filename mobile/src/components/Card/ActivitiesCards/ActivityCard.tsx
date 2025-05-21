import {
  StyleSheet,
  View,
  Text,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { CalendarDots, Lock, UsersThree } from "phosphor-react-native";
import { format } from "date-fns";
import { useTypedNavigation } from "../../../hooks/useTypedNavigation";

interface ActivitiesCardProps {
  activity: {
    private?: boolean;
    id?: string;
    name?: string;
    description?: string;
    image: string;
    scheduledDate?: string;
    participantCount?: number;
    confirmationCode?: string;
    address?: {
      latitude?: number;
      longitude?: number;
    };
  };
  creator?: string;
}

export default function ActivityCard({ activity }: ActivitiesCardProps) {
  const navigation = useTypedNavigation();
  if (!activity) return null;
  const formattedDate = activity.scheduledDate
    ? format(new Date(activity.scheduledDate), "dd/MM/yyyy HH:mm")
    : "Data não disponível";

  const handlePress = () => {
    navigation.navigate("ActivityDetails", { activity });
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {activity.private && (
            <View style={styles.buttonContainer}>
              <Lock size={25} color="white" />
            </View>
          )}

          <Image
            source={{ uri: activity.image }}
            style={{ width: "100%", height: 200 }}
          />
        </View>
        <Text style={styles.text}>{activity.name}</Text>
        <View style={styles.description}>
          <View style={styles.infoItem}>
            <CalendarDots size={20} color="#00BC7D" />
            <Text style={styles.infoText}>{formattedDate} | </Text>
          </View>
          <View style={styles.infoItem}>
            <UsersThree size={20} color="#00BC7D" />
            <Text style={styles.infoText}>{activity.participantCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    paddingVertical: 2,
  },
  imageContainer: {
    height: 200,
    overflow: "hidden",
    borderRadius: 8,
  },
  text: {
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
  description: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  infoText: {
    fontSize: 15,

    fontFamily: "DMSans-Medium",
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "#00BC7D",
    borderRadius: 50,
    position: "absolute",
    top: 0,
    left: 0,
    margin: 5,
    zIndex: 1,
  },
  private: {
    padding: 10,
    alignContent: "center",
    backgroundColor: "#00BC7D",
    position: "relative",
    margin: 10,
    zIndex: 1,
  },
});
