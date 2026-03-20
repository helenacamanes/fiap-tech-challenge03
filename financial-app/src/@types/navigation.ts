export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  AddTransaction: { type: "income" | "expense" }; // Recebe o tipo como parâmetro
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Goals: undefined;
  Profile: undefined;
};
