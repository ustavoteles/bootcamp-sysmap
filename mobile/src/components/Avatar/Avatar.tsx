import { StyleSheet, View, Image } from "react-native";
import { useEffect, useState } from "react";
import useAppContext from "../../hooks/useAppContext";
import { normalizeImageUrl } from "../../utils/normalizeImageUrl";

interface AvatarProps {
  size?: number;
  uri?: string;
}

export default function Avatar({ size = 80, uri }: AvatarProps) {
  const { auth } = useAppContext();
  const [avatarUri, setAvatarUri] = useState<string>("");

  useEffect(() => {
    if (uri) {
      setAvatarUri(uri);
    } else if (auth?.user?.avatar) {
      const formattedUrl = normalizeImageUrl(auth.user.avatar);
      setAvatarUri(formattedUrl);
    }
  }, [uri, auth]);

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={{ uri: avatarUri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: "hidden",
    borderColor: "#00BC7D",
    justifyContent: "center",
    alignItems: "center",
  },
});
