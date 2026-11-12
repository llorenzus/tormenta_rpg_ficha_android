import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface SecaoHeaderProps {
  titulo: string;
  subtitulo?: string;
  acaoTexto?: string;
  onAcaoPress?: () => void;
}

export const SecaoHeader: React.FC<SecaoHeaderProps> = ({
  titulo,
  subtitulo,
  acaoTexto,
  onAcaoPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextCol}>
        <Text style={styles.headerTitle}>{titulo.toUpperCase()}</Text>
        {!!subtitulo && <Text style={styles.headerSubtitle}>{subtitulo}</Text>}
      </View>
      {!!acaoTexto && !!onAcaoPress && (
        <TouchableOpacity style={styles.headerActionBtn} onPress={onAcaoPress}>
          <Text style={styles.headerActionText}>+ {acaoTexto}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface CampoTextoProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
}

export const CampoTexto: React.FC<CampoTextoProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
}) => {
  return (
    <View style={[styles.fieldWrap, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9D8E80"
        multiline={multiline}
      />
    </View>
  );
};

interface CampoInteiroProps {
  label?: string;
  valor: number;
  onValorChange: (novo: number) => void;
  min?: number;
  max?: number;
  style?: ViewStyle;
  compact?: boolean;
}

export const CampoInteiro: React.FC<CampoInteiroProps> = ({
  label,
  valor,
  onValorChange,
  min = -99,
  max = 9999,
  style,
  compact = false,
}) => {
  const [texto, setTexto] = useState(String(valor));

  useEffect(() => {
    setTexto(String(valor));
  }, [valor]);

  const handleChange = (novoTexto: string) => {
    if (novoTexto === '' || novoTexto === '-') {
      setTexto(novoTexto);
      return;
    }
    const parsed = parseInt(novoTexto, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setTexto(String(clamped));
      onValorChange(clamped);
    }
  };

  const handleBlur = () => {
    if (texto === '' || texto === '-') {
      const fallback = Math.max(min, Math.min(max, 0));
      setTexto(String(fallback));
      onValorChange(fallback);
    }
  };

  return (
    <View style={[styles.fieldWrap, style]}>
      {!!label && <Text style={styles.fieldLabel}>{label}</Text>}
      <TextInput
        style={[styles.textInput, styles.numberInput, compact && styles.compactNumberInput]}
        value={texto}
        onChangeText={handleChange}
        onBlur={handleBlur}
        keyboardType="numeric"
        selectTextOnFocus
      />
    </View>
  );
};

interface StepperValorProps {
  valor: number;
  onValorChange: (novo: number) => void;
  min?: number;
  max?: number;
}

export const StepperValor: React.FC<StepperValorProps> = ({
  valor,
  onValorChange,
  min = -99,
  max = 999,
}) => {
  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onValorChange(Math.max(min, valor - 1))}
      >
        <Text style={styles.stepBtnText}>-</Text>
      </TouchableOpacity>
      <CampoInteiro
        valor={valor}
        onValorChange={onValorChange}
        min={min}
        max={max}
        compact
        style={styles.stepperInputWrap}
      />
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onValorChange(Math.min(max, valor + 1))}
      >
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  headerActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerActionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fieldWrap: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  textInputMultiline: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  numberInput: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  compactNumberInput: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    minWidth: 52,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 32,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stepperInputWrap: {
    marginBottom: 0,
    marginHorizontal: 6,
    width: 56,
  },
});

