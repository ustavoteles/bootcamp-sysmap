import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import { NavigationContainer } from "@react-navigation/native";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import ActivityByCategory from "../pages/Activities/ActivityByCategory/ActivityByCategory";
import EditProfile from "../pages/Profile/EditProfile";
import CreateOrEditActivity from "../pages/Activities/CreateOrEditActivity/CreateOrEditActivity";
import ActivityDetails from "../pages/Activities/ActivityDetails/ActivityDetails";
import useAppContext from "../hooks/useAppContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export type MainStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ActivityDetails: {
    activity: {
      id?: string;
      name?: string;
      description?: string;
      image: string;
      scheduledDate?: string;
      participantCount?: number;
      private?: boolean;
      confirmationCode?: string;
    };
  };
  EditProfile: undefined;
  CreateOrEditActivity: undefined;
  ActivityByCategory: { categoryId: string };
};

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <MainStack.Screen name="Home" component={Home} />
        <MainStack.Screen name="Profile" component={Profile} />
        <MainStack.Screen name="EditProfile" component={EditProfile} />
        <MainStack.Screen name="ActivityDetails" component={ActivityDetails} />
        <MainStack.Screen
          name="CreateOrEditActivity"
          component={CreateOrEditActivity}
        />
        <MainStack.Screen
          name="ActivityByCategory"
          component={ActivityByCategory}
        />
      </MainStack.Group>
    </MainStack.Navigator>
  );
}

const LoginStack = createStackNavigator<MainStackParamList>();

function LoginStackScreen() {
  return (
    <LoginStack.Navigator initialRouteName="Login">
      <LoginStack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <LoginStack.Screen name="Login" component={Login} />
        <LoginStack.Screen name="Register" component={Register} />
      </LoginStack.Group>
    </LoginStack.Navigator>
  );
}

export default function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    auth: { isAuthenticated },
  } = useAppContext();

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#00BC7D" />
    </View>
  ) : (
    <NavigationContainer>
      {isAuthenticated ? <MainStackScreen /> : <LoginStackScreen />}
    </NavigationContainer>
  );
}
