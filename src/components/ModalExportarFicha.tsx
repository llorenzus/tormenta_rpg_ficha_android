import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';

interface ModalExportarFichaProps {
  visivel: boolean;
  ficha: FichaPersonagem | null;
  onFechar: () => void;
  onSalvarPdf: (ficha: FichaPersonagem) => void;
  onSalvarJson: (ficha: FichaPersonagem) => void;
  onCompartilharPdf: (ficha: FichaPersonagem) => void;
  onCompartilharJson: (ficha: FichaPersonagem) => void;
  onImprimirDireto: (ficha: FichaPersonagem) => void;
}

export const ModalExportarFicha: React.FC<ModalExportarFichaProps> = ({
  visivel,
  ficha,
  onFechar,
  onSalvarPdf,
  onSalvarJson,
  onCompartilharPdf,
  onCompartilharJson,
  onImprimirDireto,
}) => {
  if (!ficha) return null;

  const nomeExibicao = ficha.nomePersonagem?.trim() || 'Personagem';

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <TouchableWithoutFeedback onPress={onFechar}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Cabeçalho */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Exportar Personagem</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {nomeExibicao}
                </Text>
              </View>

              {/* Seção 1: Salvar Localmente */}
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionHeader}>💾 SALVAR NO APARELHO (LOCAL)</Text>
                <TouchableOpacity
                  style={styles.optionBtn}
                  activeOpacity={0.8}
                  onPress={() => onSalvarPdf(ficha)}
                >
                  <View style={styles.optionIconBox}>
                    <Text style={styles.optionIcon}>📄</Text>
                  </View>
                  <View style={styles.optionTextBox}>
                    <Text style={styles.optionTitle}>Salvar PDF</Text>
                    <Text style={styles.optionDesc}>
                      Grava o PDF formatado na pasta que você escolher
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionBtn}
                  activeOpacity={0.8}
                  onPress={() => onSalvarJson(ficha)}
                >
                  <View style={styles.optionIconBox}>
                    <Text style={styles.optionIcon}>💾</Text>
                  </View>
                  <View style={styles.optionTextBox}>
                    <Text style={styles.optionTitle}>Salvar JSON</Text>
                    <Text style={styles.optionDesc}>
                      Arquivo de dados .json para backup ou transferência
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Seção 2: Compartilhar */}
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionHeader}>📤 COMPARTILHAR</Text>
                <TouchableOpacity
                  style={styles.optionBtn}
                  activeOpacity={0.8}
                  onPress={() => onCompartilharPdf(ficha)}
                >
                  <View style={styles.optionIconBox}>
                    <Text style={styles.optionIcon}>📱</Text>
                  </View>
                  <View style={styles.optionTextBox}>
                    <Text style={styles.optionTitle}>Compartilhar PDF</Text>
                    <Text style={styles.optionDesc}>
                      Enviar via WhatsApp, Drive, E-mail ou Telegram
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionBtn}
                  activeOpacity={0.8}
                  onPress={() => onCompartilharJson(ficha)}
                >
                  <View style={styles.optionIconBox}>
                    <Text style={styles.optionIcon}>🔄</Text>
                  </View>
                  <View style={styles.optionTextBox}>
                    <Text style={styles.optionTitle}>Compartilhar JSON</Text>
                    <Text style={styles.optionDesc}>
                      Enviar dados para outro jogador importar no app
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Seção 3: Impressão Nativa */}
              <View style={styles.sectionWrap}>
                <TouchableOpacity
                  style={[styles.optionBtn, styles.optionBtnPrint]}
                  activeOpacity={0.8}
                  onPress={() => onImprimirDireto(ficha)}
                >
                  <View style={styles.optionIconBox}>
                    <Text style={styles.optionIcon}>🖨️</Text>
                  </View>
                  <View style={styles.optionTextBox}>
                    <Text style={styles.optionTitle}>Imprimir via Sistema</Text>
                    <Text style={styles.optionDesc}>
                      Abre o gerenciador de impressão do Android
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Botão Fechar / Cancelar */}
              <TouchableOpacity
                style={styles.btnClose}
                activeOpacity={0.8}
                onPress={onFechar}
              >
                <Text style={styles.btnCloseText}>✕ Cancelar e Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.25)',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '600',
  },
  sectionWrap: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionBtnPrint: {
    backgroundColor: '#FFF8E7',
    borderColor: COLORS.gold,
  },
  optionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: 'rgba(139, 30, 30, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  btnClose: {
    marginTop: 6,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  btnCloseText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
