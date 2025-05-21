import { Text, TouchableOpacity, View } from "react-native";
import { profileStyles } from "./profileStyles";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { CaretLeft, NotePencil, SignOut } from "phosphor-react-native";
import Avatar from "../../components/Avatar/Avatar";
import LevelAndMedalsScrollView from "../../components/Card/LevelAndMedalsCard/LevelAndMedalsScrollView";
import ScrollViewActivities from "../../components/Card/ActivitiesCards/ScrollViewActivities";
import useAppContext from "../../hooks/useAppContext";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppState";

export default function Profile() {
  const navigation = useTypedNavigation();
  const { auth } = useAppContext();

  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (auth?.user) {
      const name = auth.user.name;
      setUserName(name.toUpperCase());
    }
  }, [auth]);
  const {
    auth: { logout },
  } = useAppContext();

  return (
    <View style={{ flex: 1 }}>
      <View style={profileStyles.banner}>
        <View style={profileStyles.menu}>
          <TouchableOpacity
            style={{ width: 40 }}
            onPress={() => navigation.goBack()}
          >
            <CaretLeft size={25} weight="bold" />
          </TouchableOpacity>

          <Text style={profileStyles.title}>PERFIL</Text>

          <View style={profileStyles.buttomMenu}>
            <TouchableOpacity onPress={() => logout()}>
              <SignOut size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <NotePencil size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={profileStyles.profile}>
          <Avatar size={75} />
          <Text style={profileStyles.text}>{userName}</Text>
        </View>
      </View>
      <View style={profileStyles.container}>
        <View style={{ flex: 1, paddingTop: 190 }}>
          <LevelAndMedalsScrollView />
          <ScrollViewActivities />
        </View>
      </View>
    </View>
  );
}
