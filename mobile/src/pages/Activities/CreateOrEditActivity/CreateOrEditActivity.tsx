import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { activityStyles } from "./activityStyles";
import { useTypedNavigation } from "../../../hooks/useTypedNavigation";
import { CaretLeft } from "phosphor-react-native";
import ActivityForm from "../../../components/Form/ActivityForm";

export default function CreateOrEditActivity() {
  const navigation = useTypedNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={activityStyles.container}>
        <View style={activityStyles.menu}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={activityStyles.title}>CADASTRAR ATIVIDADE</Text>
          </View>
        </View>
        <ActivityForm />
      </View>
    </View>
  );
}
