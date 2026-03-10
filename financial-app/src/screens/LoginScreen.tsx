import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../@types/navigation';
import { auth } from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { darkTheme as COLORS } from '../theme';

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error: any) {
      console.error(error.code);
      let message = "Ocorreu um erro ao entrar.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "E-mail ou senha inválidos.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Formato de e-mail inválido.";
      }
      
      Alert.alert("Erro no Login", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="flashlight" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Lighthouse</Text>
          <Text style={styles.subtitle}>Sua clareza financeira começa aqui</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput}
              placeholder="Sua senha"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color={COLORS.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.forgotPass}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPassText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logoPlaceholder: { marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, letterSpacing: 1 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 8 },
  form: { width: '100%' },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { 
    backgroundColor: COLORS.card, 
    borderRadius: 12, 
    height: 56, 
    paddingHorizontal: 16, 
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  passwordInput: { flex: 1, color: COLORS.text, fontSize: 16 },
  forgotPass: { alignSelf: 'flex-end', marginTop: 12 },
  forgotPassText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },
  button: { 
    backgroundColor: COLORS.primary, 
    height: 56, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 32,
    elevation: 4
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' }
});