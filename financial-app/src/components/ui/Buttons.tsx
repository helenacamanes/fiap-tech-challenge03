import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "../../theme";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
}

export function Button({
  title,
  loading = false,
  disabled,
  variant = "primary",
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : COLORS.text}
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            variant === "primary" ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  base: ViewStyle;
  primary: ViewStyle;
  secondary: ViewStyle;
  disabled: ViewStyle;
  textBase: TextStyle;
  primaryText: TextStyle;
  secondaryText: TextStyle;
}>({
  base: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#223252",
  },
  disabled: {
    opacity: 0.7,
  },
  textBase: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: COLORS.text,
  },
});
