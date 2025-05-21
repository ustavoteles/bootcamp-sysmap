import { format } from "date-fns";
import { CalendarDots, UsersThree } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";
interface ActivityInfoCardProps {
  activity: {
    private?: boolean;
    scheduledDate?: string;
    participantCount?: number;
  };
  status: string;
}
export default function ActivityInfoCard({
  activity,
  status,
}: ActivityInfoCardProps) {
  const now = new Date();

  const isFinished =
    activity.scheduledDate && new Date(activity.scheduledDate) < now;

  const formattedDate = activity.scheduledDate
    ? format(new Date(activity.scheduledDate), "dd/MM/yyyy HH:mm")
    : "Data não disponível";

  const privado = activity.private ? "Privado" : "Público";

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <CalendarDots size={20} color="#00BC7D" />
        {status && (
          <Text
            style={{
              color: status === "Atividade Finalizada" ? "red" : "#000",
              fontWeight: "500",
            }}
          >
            {status}
          </Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.text]}> | {privado} | </Text>
      </View>
      <View style={styles.info}>
        <UsersThree size={20} color="#00BC7D" />
        <Text style={styles.text}>{activity.participantCount ?? 0}</Text>
      </View>
    </View>
  );
}
export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFFFFF",
    height: 65,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
    flexDirection: "row",
    marginTop: -40,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "DMSans-Regular",
  },
});
