export type RootStackParamList = {
  AuthTester: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { userId: string; isEmailMode: boolean; scheme?: string };
  Dashboard: undefined;
  OnBoardingScreen: undefined;
  CodeConfirmation: { 
    contactInfo: string; 
    signupMode: "phone" | "email"; 
    userId?: string;
    tempUserData?: {
      email: string;
      phoneNumber: string;
      fullName: string;
      password: string;
      isPlaceholder?: boolean;
    };
  };
  SetPassword: { contactInfo: string; signupMode: "phone" | "email"; userId?: string };
  VerifyPhone: { phoneNumber?: string };
  MainApp: undefined;
  PersonalInformation: undefined;
  AddressInformation: undefined;
  IdentityVerification: undefined;
  DocumentUpload: undefined;
  SecurityVerification: { actionName?: string };
  SelectCurrency: undefined;
  SelectMethod: { currency: { symbol: string; name: string; icon?: any } };
  Deposit: { currency: { symbol: string; name: string; icon?: any } };
  BankTransfer: { currency: { symbol: string; name: string; icon?: any } };
  BankTransferDetails: { amount: string; currency: string; usdcAmount: string };
  BinancePay: { currency: { symbol: string; name: string; icon?: any } };
};