import React, { useState } from "react";
import { View, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "phosphor-react-native";
import AvatarDefault from "../../../assets/avatar-default.svg";
import Avatar from "../Avatar/Avatar";

interface Props {
  onImageSelected: (uri: string) => void;
  initialImage?: string;
}

export default function ProfileImagePicker({
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

    if (!result.canceled) {
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
        <View style={[styles.placeholder, { position: "relative" }]}>
          <Avatar size={150} />
          <Camera
            size={60}
            color="white"
            style={{ position: "absolute", top: 45, right: 45, zIndex: 2 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: "#FBBC05",
    justifyContent: "center",
    alignItems: "center",
  },
});
