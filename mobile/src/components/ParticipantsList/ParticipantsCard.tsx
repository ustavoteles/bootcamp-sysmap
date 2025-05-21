import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import Avatar from "../Avatar/Avatar";
import { Heart, X, Star } from "phosphor-react-native";
import { normalizeImageUrl } from "../../utils/normalizeImageUrl";
import axios from "axios";
import { useState } from "react";
import api, { getHeaders } from "../../api/api";
type ParticipantsCardProps = {
  participant: {
    id: string;
    name: string;
    avatar: string;
    userId?: string;
    xp?: number;
  };
  activityId?: string;
  creatorId?: string;
  admin?: boolean;
  onRemove?: (participantId: string) => void;
};

export default function ParticipantCard({
  participant,
  activityId,
  creatorId,
  admin = false,
  onRemove,
}: ParticipantsCardProps) {
  const isCreator = participant.id === creatorId;
  const [hideHeart, setHideHeart] = useState(false);
  const [hideX, setHideX] = useState(false);

  const handleApproval = async (approved: boolean) => {
    try {
      if (!activityId) {
        console.warn("ID da atividade não fornecido");
        Alert.alert(
          "Erro",
          "Não foi possível processar esta ação. ID da atividade não disponível."
        );
        return;
      }

      const headers = await getHeaders();

      await api.put(
        `/activities/${activityId}/approve`,
        {
          participantId: participant.id,
          approved: approved,
        },
        { headers }
      );

      if (approved) {
        setHideHeart(true);
        Alert.alert("Sucesso", "Participante aprovado com sucesso!");
      } else {
        if (onRemove) {
          onRemove(participant.id);
        }
        Alert.alert("Sucesso", "Participante reprovado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Detalhes do erro:",
          error.response.status,
          error.response.data
        );

        let errorMessage = `Não foi possível ${approved ? "aprovar" : "reprovar"} o participante.`;
        if (error.response.status === 404) {
          errorMessage += " Participante não encontrado.";
        }

        Alert.alert("Erro", errorMessage);
      } else {
        Alert.alert(
          "Erro",
          `Não foi possível ${approved ? "aprovar" : "reprovar"} o participante. Tente novamente.`
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Avatar size={60} uri={normalizeImageUrl(participant.avatar)} />
        <View>
          <Text style={styles.text}>{participant.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isCreator && !admin && (
              <Text style={{ color: "#3A4750", fontSize: 13 }}>
                Organizador
              </Text>
            )}
            {participant.xp && participant.xp > 0 && (
              <View style={styles.xpContainer}>
                <Star size={14} color="#FFD700" weight="fill" />
                <Text style={styles.xpText}>{participant.xp} XP</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {admin && (
        <View style={{ flexDirection: "row", gap: 30 }}>
          {!hideX && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleApproval(false)}
            >
              <X size={30} color="white" weight="bold" />
            </TouchableOpacity>
          )}
          {!hideHeart && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleApproval(true)}
            >
              <Heart size={30} color="white" weight="bold" />
            </TouchableOpacity>
          )}
        </View>
      )}
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
    marginBottom: 10,
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
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3A4750",
    marginLeft: 2,
  },
});
