import React, { useState } from "react";
import { View, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "phosphor-react-native";

interface Props {
  onImageSelected: (uri: string) => void;
  initialImage?: string;
}

export default function ActivityImagePicker({
  onImageSelected,
  initialImage,
}: Props) {
  const [imageUri, setImageUri] = useState<string | undefined>(initialImage);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onImageSelected(uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Camera size={"25%"} color="black" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#D9D9D940",
    justifyContent: "center",
    alignItems: "center",
  },
});
