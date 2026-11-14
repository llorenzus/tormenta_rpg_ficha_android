import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  buscarMagiasSugeridas,
  buscarTalentosSugeridos,
  MagiaData,
  TalentoData,
} from '../data';
import { COLORS } from '../theme/colors';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  tipo: 'talento' | 'magia';
  nivelMagia?: number | null;
  onSelecionarSugestao: (item: TalentoData | MagiaData) => void;
  onAbrirCompendio?: () => void;
  placeholder?: string;
}

export const CampoComSugestoes: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  tipo,
  nivelMagia = null,
  onSelecionarSugestao,
  onAbrirCompendio,
  placeholder,
}) => {
  const [focado, setFocado] = useState(false);

  // Calcula sugestões baseadas no texto digitado
  const sugestoes = useMemo(() => {
    if (!focado || !value || value.trim().length < 2) return [];

    if (tipo === 'talento') {
      return buscarTalentosSugeridos(value, undefined, 6);
    } else {
      return buscarMagiasSugeridas(value, nivelMagia, 6);
    }
  }, [focado, value, tipo, nivelMagia]);

  const handleEscolher = (item: TalentoData | MagiaData) => {
    onSelecionarSugestao(item);
    setFocado(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {onAbrirCompendio && (
          <TouchableOpacity
            style={styles.btnAbrirCompendio}
            onPress={onAbrirCompendio}
          >
            <Text style={styles.btnAbrirCompendioText}>📖 Buscar no Compêndio</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, focado && styles.inputFocado]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          onFocus={() => setFocado(true)}
          onBlur={() => {
            // Pequeno delay para permitir o toque na sugestão antes de fechar
            setTimeout(() => setFocado(false), 250);
          }}
          autoCorrect={false}
        />
      </View>

      {/* Caixa de Sugestões Autocomplete */}
      {sugestoes.length > 0 && focado && (
        <View style={styles.sugestoesContainer}>
          <Text style={styles.sugestoesHeader}>
            {tipo === 'talento'
              ? 'Talentos encontrados na base (toque para preencher):'
              : 'Magias encontradas na base (toque para preencher):'}
          </Text>
          {sugestoes.map((item) => {
            const isTalento = 'categoria' in item;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.sugestaoItem}
                onPress={() => handleEscolher(item)}
              >
                <View style={styles.sugestaoInfo}>
                  <Text style={styles.sugestaoNome}>{item.nome}</Text>
                  <Text style={styles.sugestaoDetalhe}>
                    {isTalento
                      ? item.categoria
                      : `${item.nivel === 0 ? 'Nível 0' : item.nivel + 'º Nível'} • ${item.escola}`}
                  </Text>
                </View>
                <View style={styles.badgePreencher}>
                  <Text style={styles.badgePreencherText}>Preencher ➔</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    position: 'relative',
    zIndex: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  btnAbrirCompendio: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(200,157,60,0.15)',
  },
  btnAbrirCompendioText: {
    fontSize: 11,
    color: '#8A6414',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  inputFocado: {
    borderColor: COLORS.primary,
  },
  sugestoesContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 8,
    marginTop: 4,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sugestoesHeader: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  sugestaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  sugestaoInfo: {
    flex: 1,
  },
  sugestaoNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sugestaoDetalhe: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  badgePreencher: {
    backgroundColor: 'rgba(139,30,30,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePreencherText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
