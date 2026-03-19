import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType, useWindowDimensions } from 'react-native';
import { darkTheme as COLORS } from '../theme';

interface Props {
    image: ImageSourcePropType;
    gradient: ImageSourcePropType; // O degradê de fundo suave
    title: string;
    description: string;
}

export default function OnboardingItem({ image, gradient, title, description }: Props) {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width }]}>
            {/* Imagem de degradê de fundo suave */}
            <Image source={gradient} style={StyleSheet.absoluteFillObject} />

            <View style={styles.centerContent}>
                {/* Ícone central (Olho, Porco, Alvo) */}
                <View style={styles.iconWrapper}>
                    <Image source={image} style={styles.icon} />
                </View>

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glow suave
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
    },
    icon: { width: 60, height: 60, resizeMode: 'contain' },
    title: { fontSize: 24, color: COLORS.text, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    description: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
});