import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { activityStyles } from "./activityStyles";
import { CaretLeft, NotePencil } from "phosphor-react-native";
import { useTypedNavigation } from "../../../hooks/useTypedNavigation";
import ActivityInfoCard from "../../../components/Card/ActivitiesCards/ActivityInfoCard";
import Map from "../../../components/Map/Map";
import ConfirmationCodeCard from "../../../components/Card/ActivitiesCards/ConfirmationCodeCard";
import CustomButton from "../../../components/Buttons/CustomButtom";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import useAppContext from "../../../hooks/useAppContext";
import api, { getHeaders } from "../../../api/api";
import axios from "axios";
import ParticipantCard from "../../../components/ParticipantsList/ParticipantsCard";
import ParticipantAdminCard from "../../../components/ParticipantsList/ParticipantAdminCard";
import { format } from "date-fns";

type RouteParams = {
  activity: {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    scheduledDate?: string;
    participantCount?: number;
    private?: boolean;
    confirmationCode?: string;
    address?: {
      latitude?: number;
      longitude?: number;
    };

    creator: {
      avatar: string;
      id: string;
      name: string;
    };
  };
};

interface Participant {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  subscriptionStatus: string;
  confirmedAt: string | null;
  xp: number;
}

export default function ActivityDetails() {
  const navigation = useTypedNavigation();
  const route = useRoute();
  const { auth } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { activity } = route.params as RouteParams;
  const now = new Date();
  const isFinished =
    activity.scheduledDate && new Date(activity.scheduledDate) < now;
  const [xp, setXp] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const creatorId = activity.creator?.id;
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<
    string | null
  >(null);

  const [checkInModalVisible, setCheckInModalVisible] = useState(false);
  const [confirmationCodeInput, setConfirmationCodeInput] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const [isUserCheckedIn, setIsUserCheckedIn] = useState(false);
  const [concludeActivity, setConcludeActivity] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchParticipants();
    });

    return unsubscribe;
  }, [navigation, activity.id]);

  useEffect(() => {
    if (auth?.user && creatorId) {
      if (auth?.user.id === creatorId) {
        setAdmin(true);
      }
    }
  }, [auth?.user, creatorId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const headers = await getHeaders();

      const response = await api.get(
        `/activities/${activity.id}/participants`,
        { headers }
      );
      const participantsList = Array.isArray(response.data)
        ? response.data
        : [];
      setParticipants(participantsList);

      if (auth?.user && !admin) {
        const currentUser = participantsList.find(
          (participant) => participant.userId === auth.user.id
        );

        if (currentUser) {
          setUserSubscriptionStatus(currentUser.subscriptionStatus);
          setIsUserCheckedIn(currentUser.confirmedAt !== null);
        } else {
          setUserSubscriptionStatus(null);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Erro de resposta da API:");
          console.log("  Dados:", error.response.data);
          console.log("  Status:", error.response.status);
          console.log("  Headers:", error.response.headers);
        } else if (error.request) {
          console.error("Erro na requisição (sem resposta da API):");
          console.log("  Configuração da requisição:", error.config);
          console.log("  Request:", error.request);
        } else {
          console.error("Erro na configuração do Axios:", error.message);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [activity.id]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const headers = await getHeaders();
      await api.post(`/activities/${activity.id}/subscribe`, {}, { headers });
      setUserSubscriptionStatus("APPROVED");

      await fetchParticipants();
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      const headers = await getHeaders();
      await api.delete(`/activities/${activity.id}/unsubscribe`, { headers });
      setUserSubscriptionStatus(null);

      await fetchParticipants();
    } catch (error) {
      console.error("Erro ao sair da atividade:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (confirmationCodeInput: string) => {
    try {
      setCheckInError("");
      setLoading(true);
      const headers = await getHeaders();

      await api.put(
        `/activities/${activity.id}/check-in`,
        { confirmationCode: confirmationCodeInput },
        { headers }
      );

      setIsUserCheckedIn(true);
      await fetchParticipants();

      Alert.alert(
        "Check-in realizado",
        "Você confirmou sua presença na atividade!"
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setCheckInError("Código de confirmação inválido");
        } else {
          setCheckInError("Erro ao fazer check-in. Tente novamente.");
        }
      } else {
        setCheckInError("Erro de conexão. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addXpToParticipants = () => {
    try {
      setParticipants((prevParticipants) =>
        prevParticipants.map((p) => {
          if (p.subscriptionStatus === "APPROVED") {
            return { ...p, xp: (p.xp || 0) + 20 };
          }
          return p;
        })
      );

      const approvedParticipantsCount = participants.filter(
        (p) => p.subscriptionStatus === "APPROVED"
      ).length;

      return approvedParticipantsCount;
    } catch (error) {
      console.error("Erro ao adicionar XP aos participantes:", error);
      return 0;
    }
  };

  const handleConcludeActivity = async () => {
    try {
      setLoading(true);
      const headers = await getHeaders();

      await api.put(`/activities/${activity.id}/conclude`, {}, { headers });
      setConcludeActivity(true);

      const participantsRewarded = addXpToParticipants();

      if (participantsRewarded > 0) {
        Alert.alert(
          "Atividade Finalizada!",
          `Você finalizou sua atividade! ${participantsRewarded} participante(s) receberam 20 XP.`
        );
      } else {
        Alert.alert(
          "Atividade Finalizada!",
          "Você finalizou sua atividade! Nenhum participante aprovado recebeu XP."
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar a atividade:", error);
      Alert.alert(
        "Erro",
        "Não foi possível finalizar a atividade. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = (participantId: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== participantId)
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <FlatList
        ListHeaderComponent={
          <>
            <ImageBackground
              source={{ uri: activity.image }}
              style={activityStyles.banner}
            >
              <View style={activityStyles.menu}>
                <TouchableOpacity
                  style={{ width: 40 }}
                  onPress={() => navigation.goBack()}
                >
                  <CaretLeft size={30} weight="bold" color="white" />
                </TouchableOpacity>

                <View style={activityStyles.buttomMenu}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CreateOrEditActivity")}
                  >
                    <NotePencil size={30} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>

            <View style={activityStyles.container}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityInfoCard
                  activity={{
                    private: activity.private,
                    scheduledDate: activity.scheduledDate,
                    participantCount: activity.participantCount,
                  }}
                  status={
                    isFinished || concludeActivity
                      ? "Atividade Finalizada"
                      : activity.scheduledDate
                        ? format(
                            new Date(activity.scheduledDate),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "Data não disponível"
                  }
                />
              </View>
              <ConfirmationCodeCard
                activity={{
                  confirmationCode: activity.confirmationCode,
                }}
                admin={admin || userSubscriptionStatus === "APPROVED"}
                onCheckIn={handleCheckIn}
              />

              <View style={[activityStyles.views, { marginTop: -10 }]}>
                <Text style={activityStyles.title}>{activity.name}</Text>
                <Text style={{ fontFamily: "DMSans-Regular", fontSize: 16 }}>
                  {activity.description}
                </Text>
              </View>

              <View style={activityStyles.views}>
                <Text style={activityStyles.title}>PONTO DE ENCONTRO</Text>
                <Map
                  latitude={activity.address?.latitude}
                  longitude={activity.address?.longitude}
                />

                <Text style={activityStyles.coordsText}>
                  Latitude: {activity.address?.latitude?.toFixed(6)}, Longitude:{" "}
                  {activity.address?.longitude?.toFixed(6)}
                </Text>
              </View>
              <View style={activityStyles.views}>
                <Text style={activityStyles.title}>PARTICIPANTES</Text>
                {!admin && (
                  <ParticipantAdminCard
                    activity={{
                      id: activity.id,
                      creator: {
                        id: activity.creator.id,
                        name: activity.creator.name,
                        avatar: activity.creator.avatar,
                      },
                    }}
                    participants={[]}
                  />
                )}
                {participants && participants.length > 0 ? (
                  participants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={{
                        id: participant.id,
                        name: participant.name,
                        avatar: participant.avatar,
                      }}
                      creatorId={activity.creator?.id}
                      admin={admin}
                      activityId={activity.id}
                      onRemove={removeParticipant}
                    />
                  ))
                ) : (
                  <Text style={{ fontSize: 16, color: "#999" }}>
                    Nenhum participante encontrado.
                  </Text>
                )}
              </View>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        showsVerticalScrollIndicator={false}
        data={undefined}
        renderItem={undefined}
      />
      {admin && !isFinished && !concludeActivity && (
        <View style={activityStyles.buttonContainer}>
          <CustomButton
            text="Finalizar Atividade"
            onPress={handleConcludeActivity}
            disabled={loading}
          />
        </View>
      )}
      {(isFinished || concludeActivity) && (
        <View style={activityStyles.buttonContainer}>
          <CustomButton
            text="Atividade Finalizada"
            disabled={true}
            color="#E7000B"
            onPress={() =>
              Alert.alert(
                "Atividade Finalizada",
                "Você não pode mais se inscrever neste evento."
              )
            }
          />
        </View>
      )}
      {!admin && (
        <View style={activityStyles.buttonContainer}>
          {userSubscriptionStatus === null && (
            <CustomButton text="Participar" onPress={handleSubscribe} />
          )}
          {userSubscriptionStatus === "APPROVED" && (
            <CustomButton text="Sair" onPress={handleUnsubscribe} />
          )}
          {userSubscriptionStatus === "REJECTED" && (
            <CustomButton
              text="Inscrição Negada"
              color="#E7000B"
              disabled
              onPress={() =>
                Alert.alert(
                  "Inscrição Negada",
                  "Você não pode mais se inscrever neste evento."
                )
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
