import { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import PreferencesCard from "../Card/Preferences/PreferencesCard";
import api, { getHeaders } from "../../api/api";
import CustomButton from "../Buttons/CustomButtom";
import { CaretLeft } from "phosphor-react-native";
import { ScrollView } from "react-native-gesture-handler";
interface Preference {
  id: string;
  typeId: string;
  typeName: string;
  typeDescription: string;
  image: string;
  name: string;
}

interface ModalPreferencesProps {
  visible: boolean;
  onClose: () => void;
  preferences: Preference[];
  showButtons?: boolean;
  showBackButton?: boolean;
  onPress?: (preferenceId: string) => void;
}

export default function ModalPreferences({
  visible,
  onClose,
  onPress,
  preferences = [],
  showButtons = true,
  showBackButton = false,
}: ModalPreferencesProps) {
  const [categories, setCategories] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (preferences.length > 0) {
      setCategories(preferences);
    } else {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const headers = await getHeaders();
          const response = await api.get("/activities/types", { headers });
          setCategories(response.data);
        } catch (err) {
          console.error("Erro ao buscar categorias:", err);
          setError("Falha ao carregar categorias");
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }
  }, [preferences]);
  const handleSave = async () => {
    if (!selectedPreference) {
      setError("Selecione uma preferência antes de salvar");
      return;
    }

    try {
      const headers = await getHeaders();
      await api.post("/user/preferences/define", [selectedPreference], {
        headers,
      });
      onClose();
    } catch (err: any) {
      if (err.response) {
        console.error("Erro na requisição:", err.response.data);
        console.error("Status da resposta:", err.response.status);
        console.error("Headers da resposta:", err.response.headers);
      } else if (err.request) {
        console.error("Erro na requisição, sem resposta:", err.request);
      } else {
        console.error("Erro ao configurar a requisição:", err.message);
      }
      setError("Falha ao salvar preferências");
    }
  };

  const handlePreferencePress = (preferenceId: string) => {
    setSelectedPreference(preferenceId);
    if (onPress) onPress(preferenceId);
  };

  return (
    <View>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        {showBackButton && (
          <TouchableOpacity
            style={{ marginBottom: -30, marginTop: 40, paddingHorizontal: 40 }}
            onPress={onClose}
          >
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>
        )}
        <View style={styles.modalContainer}>
          <Text style={styles.title}>SELECIONE SEU TIPO FAVORITO</Text>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.scrollArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((preference) => (
                <PreferencesCard
                  key={preference.id}
                  preference={preference}
                  onPress={() => handlePreferencePress(preference.id)}
                  style={{
                    borderWidth:
                      selectedPreference === preference.typeId ? 4 : 0,
                    borderColor:
                      selectedPreference === preference.typeId
                        ? "green"
                        : "transparent",
                  }}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.buttons}>
            <CustomButton text="Salvar" onPress={handleSave} />
            {showButtons && (
              <CustomButton
                text="Pular"
                color="white"
                textColor="black"
                onPress={onClose}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: "BebasNeue-Regular",
    marginBottom: 10,
  },
  scrollArea: {
    height: "70%",
  },
  content: {
    paddingBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
  },
  buttons: {
    gap: 10,
  },
  scrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
