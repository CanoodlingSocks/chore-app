import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import AvatarScreen from "./screens/AvatarScreen";
import ChoreOverview from "./screens/ChoreOverview";
import HeaderMenu from "./shared/Header";
import AddChoreScreen from "./screens/AddChoreScreen";
import EditChoreScreen from "./screens/EditChoreScreen";

const Stack = createStackNavigator();

const StackNavigator: React.FC = () => {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="Avatar">
        <Stack.Screen
          name="Avatar"
          component={AvatarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChoreOverview"
          component={ChoreOverview}
          options={{
            header: ({ navigation }) => <HeaderMenu navigation={navigation} />,
          }}
        />
        <Stack.Screen
          name="AddChore"
          component={AddChoreScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditChore"
          component={EditChoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
};

export default StackNavigator;
