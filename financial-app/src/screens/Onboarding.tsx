import React, { useState, useRef } from 'react';
import {
    StyleSheet, View, FlatList, TouchableOpacity, Text, SafeAreaView,
    useWindowDimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../@types/navigation';
import OnboardingItem from '../components/OnboardingItem';
import { darkTheme as COLORS } from '../theme';

const slides = [
    {
        id: '1',
        image: require('../../assets/eye.png'),
        title: 'Clareza sobre seus gastos',
        description: 'Visualize para onde seu dinheiro está indo com clareza total, como um farol iluminando o oceano.',
    },
    {
        id: '2',
        image: require('../../assets/pig.png'),
        title: 'Controle do seu orçamento',
        description: 'Defina limites e acompanhe seus gastos em tempo real. Mantenha-se no rumo certo.',
    },
    {
        id: '3',
        image: require('../../assets/target.png'),
        title: 'Metas que você consegue enxergar',
        description: 'Estabeleça objetivos financeiros e acompanhe seu progresso. Cada passo iluminado conta.',
    },
];

type NavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
    navigation: NavigationProp;
}

export default function Onboarding ({ navigation }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { width } = useWindowDimensions();

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={slides}
                renderItem={({ item }) => <OnboardingItem {...item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled 
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(event) => {
                    const contentOffset = event.nativeEvent.contentOffset.x;
                    setCurrentIndex(Math.round(contentOffset / width));
                }}
                ref={flatListRef}
            />

            <View style={styles.footer}>
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && { backgroundColor: COLORS.primary, width: 20 }
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {currentIndex === slides.length - 1 ? 'Começar' : 'Continuar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Login')}
                    
                >
                    <Text style={styles.linkText}>Já tenho conta</Text>
                    
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: COLORS.background,  minHeight: '100%' },
    footer: { paddingHorizontal: 32, paddingBottom: 40, alignItems: 'center' },
    dotsContainer: { flexDirection: 'row', marginBottom: 32 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginRight: 8 },
    button: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    linkButton: { marginTop: 24 },
    linkText: { color: COLORS.textSecondary, fontSize: 14 },
});