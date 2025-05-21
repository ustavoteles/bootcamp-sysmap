import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ActivityImagePicker from "../ImagePicker/ActivityImagePicker";
import CategoriesScrollView from "../CategoriesScrollView/CategoriesScrollView";
import { useState } from "react";
import { Text } from "react-native";
import { TextInput } from "react-native";
import CustomButton from "../Buttons/CustomButtom";
import DatePicker from "../DatePicker/DatePicker";
import Map from "../Map/Map";
import axios from "axios";
import api, { getHeaders } from "../../api/api";
import { useNavigation } from "@react-navigation/native";

export default function ActivityForm() {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypeId, setSelectedType] = useState("");

  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [address, setAddress] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState<"privado" | "publico">("privado");

  const [show, setShow] = useState(false);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    const currentDate = new Date();

    if (selectedDate) {
      const selectedDateNormalized = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      const currentDateNormalized = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      if (selectedDateNormalized < currentDateNormalized) {
        Alert.alert(
          "Erro",
          "A data selecionada não pode ser anterior à data atual."
        );
        return;
      }

      setDate(selectedDate);
    }

    setShow(Platform.OS === "ios");
  };
  const handleCategorySelect = (id: string) => {
    setSelectedType(id);
  };

  const isFormValid = () => {
    if (!title) {
      Alert.alert("Erro", "O título é obrigatório");
      return false;
    }
    if (!description) {
      Alert.alert("Erro", "A descrição é obrigatória");
      return false;
    }
    if (!selectedTypeId) {
      Alert.alert("Erro", "Selecione um tipo de atividade");
      return false;
    }
    if (!profileImage) {
      Alert.alert("Erro", "Selecione uma imagem para a atividade");
      return false;
    }
    if (!address) {
      Alert.alert("Erro", "Defina um ponto de encontro no mapa");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    try {
      if (
        !title ||
        !description ||
        !selectedTypeId ||
        !profileImage ||
        !address
      ) {
        Alert.alert(
          "Erro",
          "Por favor, preencha todos os campos obrigatórios."
        );
        return;
      }

      const formattedDate = date.toISOString();
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("typeId", selectedTypeId);
      formData.append("scheduledDate", formattedDate);
      formData.append("private", isPrivate.toString());

      if (address) {
        formData.append(
          "address",
          JSON.stringify({
            latitude: address.latitude,
            longitude: address.longitude,
          })
        );
      }

      if (profileImage) {
        const fileName = profileImage.split("/").pop() || "image.jpg";
        const file = {
          uri: profileImage,
          name: fileName,
          type: "image/jpeg",
        } as any;
        formData.append("image", file as any);
      }

      const headers = await getHeaders();
      const response = await api.post("/activities/new", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Sucesso!", "Atividade criada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Erro do Axios:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        const errorMessage =
          error.response?.data?.error ||
          "Erro ao criar atividade. Por favor, tente novamente.";
        Alert.alert("Erro", errorMessage);
      } else {
        console.error("Erro inesperado:", error);
        Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginVertical: 10 }}>
          <View style={{ width: 350, height: 205, marginVertical: 10 }}>
            <ActivityImagePicker onImageSelected={setProfileImage} />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.text}>
              Título<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              autoCapitalize="words"
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Aula de Yoga"
            />

            <Text style={styles.text}>
              Descrição<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              autoCapitalize="sentences"
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Como será a atividade? O que é necessário para participar?"
            />
          </View>

          <Text style={styles.text}>
            Data do Evento<Text style={{ color: "red" }}>*</Text>
          </Text>
          <DatePicker
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                console.log(
                  "Nova data selecionada:",
                  selectedDate.toISOString()
                );
                setDate(selectedDate);
              }
            }}
          />

          <Text style={styles.text}>
            Ponto de Encontro<Text style={{ color: "red" }}>*</Text>
          </Text>
          <Map
            onLocationChange={(latitude, longitude) => {
              setAddress({ latitude, longitude });
            }}
          />
          {address && (
            <Text style={styles.coordsText}>
              Latitude: {address.latitude.toFixed(6)}, Longitude:{" "}
              {address.longitude.toFixed(6)}
            </Text>
          )}

          <Text style={styles.text}>Requer aprovação para participar</Text>
          <View style={styles.row}>
            <CustomButton
              text="Privado"
              color={selected === "privado" ? "black" : "#6969691A"}
              textColor={selected === "privado" ? "white" : "gray"}
              onPress={() => {
                setIsPrivate(true);
                setSelected("privado");
              }}
            />
            <CustomButton
              text="Público"
              color={selected === "publico" ? "black" : "#6969691A"}
              textColor={selected === "publico" ? "white" : "gray"}
              onPress={() => {
                setIsPrivate(false);
                setSelected("publico");
              }}
            />
          </View>

          <Text style={styles.text}>
            Tipo de Atividade<Text style={{ color: "red" }}>*</Text>
          </Text>
          <CategoriesScrollView showTitle onPress={handleCategorySelect} />

          <View
            style={{
              width: "95%",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
            }}
          >
            <CustomButton
              text="Salvar"
              color="#00BC7D"
              fullWidth={true}
              onPress={handleSubmit}
            />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={[styles.button, pressed && styles.buttonPressed]}
            >
              <Text
                style={{
                  fontFamily: "DMSans-Bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Cancelar Atividade
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: "DMSans-Medium",
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    height: 50,
    width: "95%",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 50,
  },
  buttonPressed: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  coordsText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    marginLeft: 4,
  },
});
