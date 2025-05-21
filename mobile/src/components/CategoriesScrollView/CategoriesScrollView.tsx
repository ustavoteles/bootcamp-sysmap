import { ScrollView, StyleSheet, Text, View } from "react-native";
import CategoriesCard from "../Card/ActivitiesCards/CategoriesCard";
import { useEffect, useState } from "react";
import api, { getHeaders } from "../../api/api";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  confirmationCode: string;
}

interface CategoriesScrollViewProps {
  showTitle?: boolean;
  onPress?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}
export default function CategoriesScrollView({
  showTitle = true,
  onPress,
  selectedCategoryId: selectedCategoryIdProp,
}: CategoriesScrollViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (selectedCategoryIdProp) {
      setSelectedCategoryId(selectedCategoryIdProp);
    }
  }, [selectedCategoryIdProp]);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    if (onPress) onPress(categoryId);
  };

  return (
    <View style={styles.containerCategories}>
      {showTitle && <Text style={styles.text}>CATEGORIAS</Text>}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {categories.map((category) => (
          <CategoriesCard
            key={category.id}
            category={category}
            onPress={() => handleCategoryPress(category.id)}
            style={{
              borderWidth: selectedCategoryId === category.id ? 4 : 0,
              borderColor:
                selectedCategoryId === category.id ? "green" : "transparent",
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 15,
    paddingLeft: 5,
  },
  containerCategories: { marginTop: 15 },
  text: { fontSize: 28, fontWeight: "bold", fontFamily: "BebasNeue-Regular" },
});
