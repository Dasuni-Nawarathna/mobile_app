import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { Brand } from '@/constants/brand';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'gold' | 'outline';
};

export function PrimaryButton({ title, loading, variant = 'gold', disabled, ...rest }: Props) {
  const inactive = !!disabled || !!loading;
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        variant === 'gold' ? styles.gold : styles.outline,
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'gold' ? Brand.deepEmerald : Brand.antiqueGold} />
      ) : (
        <Text style={[styles.label, variant === 'outline' && styles.labelOutline]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  gold: {
    backgroundColor: Brand.antiqueGold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Brand.antiqueGold,
  },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.9 },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.deepEmerald,
    letterSpacing: 0.5,
  },
  labelOutline: { color: Brand.antiqueGold },
});
