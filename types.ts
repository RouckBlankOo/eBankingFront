export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { userId: string; isEmailMode: boolean; scheme?: string };
  Dashboard: undefined;
  OnBoardingScreen: undefined;
  CodeConfirmation: { contactInfo: string; signupMode: "phone" | "email" };
  SetPassword: { contactInfo: string; signupMode: "phone" | "email" };
  MainApp: undefined;
  PersonalInformation: undefined;
  AddressInformation: undefined;
  IdentityVerification: undefined;
  DocumentUpload: undefined;
  