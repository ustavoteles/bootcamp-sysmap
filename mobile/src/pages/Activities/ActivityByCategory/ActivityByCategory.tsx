import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { activitycategoryStyles } from "./activitycategoriesStyles";
import { CaretLeft } from "phosphor-react-native";
import CategoriesScrollView from "../../../components/CategoriesScrollView/CategoriesScrollView";
import ScrollViewCategoryActivities from "../../../components/Card/ActivitiesCards/ScrollViewCategoryActivities";
import { useTypedNavigation } from "../../../hooks/useTypedNavigation";
import api, { getHeaders } from "../../../api/api";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

export interface ActivityType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function ActivityByCategory() {
  const navigation = useTypedNavigation();
  const route = useRoute();
  const { categoryId: initialCategoryId } = route.params as {
    categoryId: string;
  };

  const [categoryId, setCategoryId] = useState(initialCategoryId);

  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const category = activityTypes.find((item) => item.id === categoryId);
  const categoryName = category?.name ?? "Categoria";

  useEffect(() => {
    const loadActivityTypes = async () => {
      try {
        const response = await api.get("/activities/types", {
          headers: await getHeaders(),
        });
        setActivityTypes(response.data);
      } catch (err) {
        console.error("Erro ao buscar tipos:", err);
      }
    };

    loadActivityTypes();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={activitycategoryStyles.container}>
        <View style={activitycategoryStyles.menu}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={activitycategoryStyles.title}>
              {categoryName.toUpperCase()}
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ marginVertical: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <CategoriesScrollView onPress={setCategoryId} />
          </View>
          <ScrollViewCategoryActivities categoryId={categoryId} />
        </ScrollView>
      </View>
    </ScrollView>
  );
}
