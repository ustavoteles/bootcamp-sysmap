import { CaretDown, CaretUp } from "phosphor-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActivityCard from "./ActivityCard";
import { useEffect, useState } from "react";
import api, { getHeaders } from "../../../api/api";
import { API_URL } from "@env";
import { normalizeImageUrl } from "../../../utils/normalizeImageUrl";

type Activity = {
  image: string;
  id: string;
  title: string;
  date: string;
  participants: number;
  private: boolean;
  description: string;
  confirmationCode: string;
};

export default function ScrollViewActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const headers = await getHeaders();
        const response = await api.get("/activities", { headers });

        const rawActivities = response.data.activities;

        const formattedActivities = rawActivities.map((activity: any) => ({
          ...activity,
          image: normalizeImageUrl(activity.image),
        }));

        setActivities(formattedActivities);
      } catch (err) {
        console.error("Erro ao buscar atividades: ", err);
        setError("Falha ao carregar atividades");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>SUAS ATIVIDADES</Text>
        <TouchableOpacity
          style={styles.title}
          onPress={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <CaretUp size={32} weight="bold" style={{ marginEnd: 2 }} />
          ) : (
            <CaretDown size={32} weight="bold" style={{ marginEnd: 2 }} />
          )}
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View>
          {activities.map(
            (activity) =>
              activity && (
                <ActivityCard
                  key={activity.id}
                  activity={{
                    ...activity,
                    name: activity.title,
                    description: activity.description,
                    image: activity.image,
                    private: activity.private,
                    confirmationCode: activity.confirmationCode,
                  }}
                />
              )
          )}
        </View>
      )}

      <Text style={[styles.text, { marginTop: 12 }]}>
        HISTÓRICO DE ATIVIDADES
      </Text>
      <View style={{ gap: 24 }}>
        {activities
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB.getTime() - dateA.getTime();
          })
          .map(
            (activity) =>
              activity && (
                <ActivityCard
                  key={activity.id}
                  activity={{
                    ...activity,
                    name: activity.title,
                    description: activity.description,
                    image: activity.image,
                    private: activity.private,
                    confirmationCode: activity.confirmationCode,
                  }}
                />
              )
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
    paddingHorizontal: 6,
  },
  title: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 28,
    fontFamily: "BebasNeue-Regular",
  },
});
