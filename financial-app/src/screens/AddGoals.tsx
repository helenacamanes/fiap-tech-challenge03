import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGoals } from "../contexts/GoalsContext";

export default function AddGoal() {
    const navigation = useNavigation();
    const { addGoal } = useGoals();

    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [initial, setInitial] = useState("");

    const isValid = title.trim().length > 0 && target.trim().length > 0;

    function handleCreate() {
        const targetValue = parseFloat(target.replace(",", "."));
        const initialValue = parseFloat(initial.replace(",", ".")) || 0;

        if (!isValid || isNaN(targetValue) || targetValue <= 0) return;

        addGoal({
            title: title.trim(),
            target: targetValue,
            current: initialValue,
            icon: "star-outline",
            color: "#3B82F6",
        });

        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

            <View style={styles.topArea}>
                <Text style={styles.screenTitle}>Adicionar meta</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.sheetWrapper}
            >
                <View style={styles.sheet}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Nova meta</Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="close" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Nome da meta</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Viagem dos sonhos"
                                placeholderTextColor="#475569"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Valor alvo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 10000"
                                placeholderTextColor="#475569"
                                keyboardType="numeric"
                                value={target}
                                onChangeText={setTarget}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Valor inicial (opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Quanto você já tem?"
                                placeholderTextColor="#475569"
                                keyboardType="numeric"
                                value={initial}
                                onChangeText={setInitial}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.createBtn, !isValid && styles.createBtnDisabled]}
                            onPress={handleCreate}
                            activeOpacity={0.85}
                            disabled={!isValid}
                        >
                            <Text style={styles.createBtnText}>Criar meta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A0F1E",
    },
    topArea: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    screenTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#94A3B8",
    },
    sheetWrapper: {
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#1E293B",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 36,
        borderTopWidth: 1,
        borderColor: "#334155",
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#F1F5F9",
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#334155",
        justifyContent: "center",
        alignItems: "center",
    },
    fieldGroup: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#0F172A",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#334155",
        paddingHorizontal: 14,
        paddingVertical: 13,
        color: "#F1F5F9",
        fontSize: 15,
    },
    createBtn: {
        backgroundColor: "#2563EB",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    createBtnDisabled: {
        opacity: 0.45,
    },
    createBtnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
    cancelBtn: {
        alignItems: "center",
        paddingVertical: 10,
    },
    cancelBtnText: {
        color: "#64748B",
        fontWeight: "600",
        fontSize: 14,
    },
});