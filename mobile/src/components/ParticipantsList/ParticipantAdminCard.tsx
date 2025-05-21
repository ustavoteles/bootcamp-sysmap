import { Text, View, StyleSheet } from "react-native";
import Avatar from "../Avatar/Avatar";
import { normalizeImageUrl } from "../../utils/normalizeImageUrl";

interface ParticipantsAdminCardProps {
  activity: {
    id?: string;
    creator: {
      avatar: string;
      id: string;
      name: string;
    };
  };
  participants: {
    userId: string;
    avatar: string;
  }[];
}

export default function ParticipantAdminCard({
  activity,
  participants,
}: ParticipantsAdminCardProps) {
  if (!activity || !activity.creator) {
    return null;
  }

  const matchingParticipant = participants.find(
    (participant) => participant.userId === activity.creator.id
  );

  const avatarUrl = matchingParticipant
    ? normalizeImageUrl(matchingParticipant.avatar)
    : normalizeImageUrl(activity.creator.avatar);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Avatar size={60} uri={avatarUrl} />
        <View>
          <Text style={styles.text}>{activity.creator.name}</Text>
          <Text style={{ color: "#3A4750", fontSize: 13 }}>Organizador</Text>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  button: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: "#00BC7D",
  },
  text: {
    fontSize: 20,
    fontFamily: "BebasNeue-Regular",
  },
});
