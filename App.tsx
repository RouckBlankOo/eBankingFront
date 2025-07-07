import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import SecurityVerificationScreen from "./components/SecurityVerificationScreen";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./navigator/AppNavigator";
import AddressInformationScreen from "./screens/AddressInformationScreen";
import AuthTester from "./screens/AuthTester";
import BankTransferScreen from "./screens/BankTransferScreen";
import BankTransferDetailsScreen from "./screens/BankTransferDetailsScreen";
import BinancePayScreen from "./screens/BinancePayScreen";
import CodeConfirmationScreen from "./screens/CodeConfirmationScreen";
import DepositScreen from "./screens/DepositScreen";
import DocumentUploadScreen from "./screens/DocumentUploadScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import IdentityVerificationScreen from "./screens/IdentityVerificationScreen";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import PersonalInformationScreen from "./screens/PersonalInformationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SelectCurrencyScreen from "./screens/SelectCurrencyScreen";
import SelectMethodScreen from "./screens/SelectMethodScreen";
import SetPasswordScreen from "./screens/SetPasswordScreen";
import SignUpScreen from "./screens/SignUpScreen";
import VerifyPhoneScreen from "./screens/VerifyPhoneScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import CardTypesScreen from "./screens/CardTypesScreen";
import ChooseCardScreen from "./screens/ChooseCardScreen";
import CardCustomizationScreen from "./screens/CardCustomizationScreen";

// Enable react-native-screens for better performance
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 300,
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 250,
                  },
                },
              },
            }}
          >
            <Stack.Screen
              name="AuthTester"
              component={AuthTester}
              options={{
                headerShown: true,
                title: "Authentication Tester",
              }}
            />
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
              name="VerifyPhone"
              component={VerifyPhoneScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainApp"
              component={AppNavigator}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
                gestureEnabled: false, // Disable gesture for main tab navigator
              }}
            />
            <Stack.Screen
              name="PersonalInformation"
              component={PersonalInformationScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="AddressInformation"
              component={AddressInformationScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="IdentityVerification"
              component={IdentityVerificationScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="DocumentUpload"
              component={DocumentUploadScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="SecurityVerification"
              component={SecurityVerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectCurrency"
              component={SelectCurrencyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectMethod"
              component={SelectMethodScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Deposit"
              component={DepositScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.ModalPresentationIOS,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="BankTransfer"
              component={BankTransferScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="BankTransferDetails"
              component={BankTransferDetailsScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="BinancePay"
              component={BinancePayScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="Withdraw"
              component={WithdrawScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.ModalPresentationIOS,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="CardTypes"
              component={CardTypesScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="ChooseCard"
              component={ChooseCardScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="CardCustomization"
              component={CardCustomizationScreen}
              options={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
