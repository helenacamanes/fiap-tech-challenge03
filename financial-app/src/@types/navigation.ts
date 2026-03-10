export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  AddTransaction: { type: 'income' | 'expense' }; // Recebe o tipo como parâmetro
};