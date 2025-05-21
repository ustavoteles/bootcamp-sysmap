import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "./homeStyles";
import ActivityCard from "../../components/Card/ActivitiesCards/ActivityCard";
import CategoriesScrollView from "../../components/CategoriesScrollView/CategoriesScrollView";
import { Plus } from "phosphor-react-native";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import ModalPreferences from "../../components/Modal/ModalPreferences";
import { useContext, useEffect, useState } from "react";
import Avatar from "../../components/Avatar/Avatar";
import StarImage from "../../../assets/star.svg";

import { AppContext } from "../../context/AppState";
import useAppContext from "../../hooks/useAppContext";
import api, { getHeaders } from "../../api/api";
import { normalizeImageUrl } from "../../utils/normalizeImageUrl";

interface Activity {
  private?: boolean;
  id?: string;
  title?: string;
  description?: string;
  image: string;
  scheduledDate?: string;
  participantCount?: number;
  confirmationCode?: string;
}

export default function Home() {
  const navigation = useTypedNavigation();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const { auth } = useAppContext();
  const [userName, setUserName] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (auth?.user) {
      const level = auth.user.level;
      setUserLevel(level);
    }
  }, [auth]);

  useEffect(() => {
    if (auth?.user) {
      const name = auth.user.name.split(" ")[0];
      setUserName(name.toUpperCase());
    }
  }, [auth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

  function getRandomActivities(list: Activity[], count = 2) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalPreferences
        visible={showModal}
        onClose={handleCloseModal}
        preferences={[]}
      />

      <View style={homeStyles.banner}>
        <View style={homeStyles.header}>
          <Text style={[homeStyles.title]}>Olá, seja bem-vindo!</Text>
          <Text style={homeStyles.name}>{userName}!</Text>
        </View>

        <View style={homeStyles.profile}>
          <View style={homeStyles.square}>
            <StarImage />
            <Text style={homeStyles.text}>{userLevel}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Avatar size={60} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={homeStyles.container}>
        <View style={homeStyles.recommendations}>
          <View style={homeStyles.recommendationsTitleContainer}>
            <Text style={homeStyles.recommendationsTitle}>
              SUAS RECOMENDAÇÕES
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={homeStyles.recommendationsSeeMore}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ height: "60%" }}
            contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {getRandomActivities(activities).map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() =>
                  console.log("Navigation to ActivityDetails", activity.id)
                }
              >
                <ActivityCard
                  activity={{
                    ...activity,
                    name: activity.title,
                    description: activity.description,
                    image: activity.image,
                    private: activity.private,
                    confirmationCode: activity.confirmationCode,
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <CategoriesScrollView
          onPress={(categoryId: string) => {
            navigation.navigate("ActivityByCategory", { categoryId });
          }}
        />

        <TouchableOpacity
          style={homeStyles.newActivityButton}
          onPress={() => navigation.navigate("CreateOrEditActivity")}
        >
          <Plus weight="bold" color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
