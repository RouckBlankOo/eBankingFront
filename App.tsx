import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import SecurityVerificationScreen from "./components/SecurityVerificationScreen";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./navigator/AppNavigator";
import AddressInformationScreen from "./screens/AddressInformationScreen";
import CodeConfirmationScreen from "./screens/CodeConfirmationScreen";
import DocumentUploadScreen from "./screens/DocumentUploadScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import IdentityVerificationScreen from "./screens/IdentityVerificationScreen";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import PersonalInformationScreen from "./screens/PersonalInformationScreen";
import SetPasswordScreen from "./screens/SetPasswordScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="OnBoardingScreen">
            <Stack.Screen
              name="OnBoardingScreen"
              component={OnBoardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CodeConfirmation"
              component={CodeConfirmationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SetPassword"
              component={SetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainApp"
              component={AppNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PersonalInformation"
              component={PersonalInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddressInformation"
              component={AddressInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="IdentityVerification"
              component={IdentityVerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DocumentUpload"
              component={DocumentUploadScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SecurityVerification"
              component={SecurityVerificationScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
