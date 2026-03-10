import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../@types/navigation';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { COLORS } from '../theme';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddTransaction'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;

interface Props {
  navigation: NavigationProp;
  route: ScreenRouteProp;
}

export default function AddTransactionScreen({ navigation, route }: Props) {
  const { type } = route.params;
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !value) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          title,
          value: parseFloat(value.replace(',', '.')),
          type,
          icon: type === 'income' ? 'cash-outline' : 'cart-outline',
          date: serverTimestamp(),
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova {type === 'income' ? 'Receita' : 'Despesa'}</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Título</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: Aluguel, Salário..."
            placeholderTextColor={COLORS.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { marginTop: 24 }]}>Valor (R$)</Text>
          <TextInput 
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: type === 'income' ? COLORS.success : COLORS.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Adicionar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, alignItems: 'center' },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { 
    backgroundColor: COLORS.card, 
    borderRadius: 12, 
    height: 56, 
    paddingHorizontal: 16, 
    color: COLORS.text, 
    fontSize: 18 
  },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' }
});