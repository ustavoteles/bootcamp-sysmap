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
import { normalizeImageUrl } from "../../../utils/normalizeImageUrl";

interface ScrollViewCategoryActivitiesProps {
  categoryId: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  participants: number;
  typeId: string;
  private: boolean;
  confirmationCode: string;
}

export default function ScrollViewCategoryActivities({
  categoryId,
}: ScrollViewCategoryActivitiesProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [communityActivities, setCommunityActivities] = useState<Activity[]>(
    []
  );
  useEffect(() => {
    if (!categoryId) return;

    const fetchActivities = async () => {
      try {
        const headers = await getHeaders();

        const userRes = await api.get("/activities/user/participant", {
          headers,
          params: {
            page: 0,
            size: 100,
            typeId: categoryId,
          },
        });

        const userData = Array.isArray(userRes.data?.content)
          ? userRes.data.content
          : [];
        setUserActivities(userData);

        const communityRes = await api.get("/activities", {
          headers,
          params: {
            page: 0,
            size: 100,
            typeId: categoryId,
          },
        });

        const communityData = Array.isArray(communityRes.data?.activities)
          ? communityRes.data.activities
          : [];
        setCommunityActivities(communityData);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    fetchActivities();
  }, [categoryId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>SUAS ATIVIDADES</Text>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <CaretUp size={32} weight="bold" />
          ) : (
            <CaretDown size={32} weight="bold" />
          )}
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={{ gap: 24 }}>
          {userActivities.filter((a) => a.typeId === categoryId).length > 0 ? (
            userActivities
              .filter((a) => a.typeId === categoryId)
              .map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={{
                    ...activity,
                    name: activity.title,
                    image: normalizeImageUrl(activity.image),
                  }}
                />
              ))
          ) : (
            <Text style={{ fontFamily: "DMSans-Regular", padding: 6 }}>
              Você ainda não está participando de nenhuma atividade dessa
              categoria.
            </Text>
          )}
        </View>
      )}

      <View style={{ marginTop: 10 }}>
        <Text style={styles.text}>ATIVIDADES DA COMUNIDADE</Text>
        <View style={{ gap: 24 }}>
          {communityActivities.length > 0 ? (
            communityActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={{
                  ...activity,
                  name: activity.title,

                  image: normalizeImageUrl(activity.image),
                }}
              />
            ))
          ) : (
            <Text style={{ fontFamily: "DMSans-Regular", padding: 6 }}>
              Nenhuma atividade da comunidade encontrada nessa categoria.
            </Text>
          )}
        </View>
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
