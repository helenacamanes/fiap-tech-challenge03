export type RootStackParamList = {
  AddTransaction: { type: "income" | "expense" }; // Recebe o tipo como parâmetro
  ForgotPassword: undefined;
  Home: undefined;
  Login: undefined;
  MainTabs: undefined;
  Onboarding: undefined;
  Register: undefined;
  Transactions: undefined;
  AddGoal: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Goals: undefined;
  Profile: undefined;
};
