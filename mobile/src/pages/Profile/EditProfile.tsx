import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { CaretLeft, NotePencil } from "phosphor-react-native";
import { editprofileStyles } from "./editprofileStyles";
import RegisterForm, {
  registerSchema,
} from "../../components/Form/RegisterForm";
import { z } from "zod";
import CustomButton from "../../components/Buttons/CustomButtom";
import { useState } from "react";
import CategoriesScrollView from "../../components/CategoriesScrollView/CategoriesScrollView";
import ModalPreferences from "../../components/Modal/ModalPreferences";
import ProfileImagePicker from "../../components/ImagePicker/ProfileImagePicker";
import api, { getHeaders } from "../../api/api";
import axios from "axios";
import useAppContext from "../../hooks/useAppContext";

type EditProfileFormData = z.infer<typeof registerSchema>;

export default function EditProfile() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { auth } = useAppContext();

  const {
    auth: { logout },
  } = useAppContext();
  const handleEditProfile = async (data: EditProfileFormData) => {
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  };
  const handleDeactivateAccount = () => {
    Alert.alert(
      "Desativar Conta",
      "Tem certeza que deseja desativar sua conta? Esta ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desativar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const headers = await getHeaders();
              await api.delete("/user/deactivate", { headers });
              await logout();
              Alert.alert(
                "Conta Desativada",
                "Sua conta foi desativada com sucesso.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.replace("Login");
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.error("Erro ao desativar conta:", error);

              if (axios.isAxiosError(error)) {
                console.error("Detalhes do erro:", {
                  status: error.response?.status,
                  data: error.response?.data,
                });
              }

              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Não foi possível desativar sua conta."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  const navigation = useTypedNavigation();

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={editprofileStyles.container}>
        <View style={editprofileStyles.menu}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={editprofileStyles.title}>ATUALIZAR PERFIL</Text>
          </View>
        </View>
        <ProfileImagePicker onImageSelected={setProfileImage} />
        <RegisterForm
          showButtons={false}
          onSubmitOverride={handleEditProfile}
          isCpfEditable={false}
        />
        <View
          style={{
            width: "100%",
            marginBottom: 55,
          }}
        >
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 9,
            }}
          >
            <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: 28 }}>
              PREFERÊNCIAS
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <NotePencil size={28} />
            </TouchableOpacity>
          </View>

          <CategoriesScrollView showTitle={false} />
        </View>
        <View
          style={{
            width: "75%",
            justifyContent: "center",
            alignItems: "center",
            gap: 17,
          }}
        >
          <CustomButton text="Salvar" color="#00BC7D" fullWidth={true} />

          <TouchableOpacity
            onPress={handleDeactivateAccount}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[
              editprofileStyles.button,
              pressed && editprofileStyles.buttonPressed,
            ]}
          >
            <Text
              style={{
                fontFamily: "DMSans-Bold",
                fontSize: 16,
                marginBottom: 20,
              }}
            >
              Desativar Conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalPreferences
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        showButtons={false}
        showBackButton={true}
        preferences={[]}
      />
    </ScrollView>
  );
}
