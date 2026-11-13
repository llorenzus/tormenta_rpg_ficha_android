# Fichas Tormenta RPG (React Native + Expo Go)

Aplicativo para gerenciamento local de fichas de personagem do sistema **Tormenta RPG**, desenvolvido em **React Native + Expo (TypeScript)** para rodar diretamente no celular (via **APK** ou **Expo Go**).

> **Sobre o Projeto:** Este é um **projeto pessoal** criado para administrar as fichas de RPG das mesas em que jogo. Por esse motivo, nem todas as regras ou cálculos estão estritamente de acordo com o manual oficial, sendo adaptados para a forma pessoal e regras da casa (*homebrew*) com que jogamos.

## Como Rodar no Seu Celular com Expo Go

1. Instale o aplicativo **Expo Go** no seu celular (Google Play Store ou App Store).
2. Certifique-se de ter o **Node.js** instalado no seu computador.
3. No terminal, dentro desta pasta (`ficha_tormenta_android`), instale as dependências:
   ```bash
   npm install
   npx expo install @react-native-async-storage/async-storage expo-status-bar
   ```
4. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
   *(Se o seu celular e o PC estiverem em redes diferentes ou o QR Code não conectar via Wi-Fi local, use `npx expo start --tunnel`)*
5. Abra o **Expo Go** no seu celular e escaneie o **QR Code** exibido no terminal!

## Estrutura do Projeto

- [App.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/App.tsx) — Gerenciamento de navegação entre a lista de fichas e a ficha aberta, com salvamento automático local.
- [src/models/ficha.ts](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/models/ficha.ts) — Modelos de dados, lista das 19 perícias oficiais e cálculos automáticos de Modificadores de Atributo, CA e Perícias.
- [src/storage/fichaStorage.ts](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/storage/fichaStorage.ts) — Persistência 100% local no dispositivo via `AsyncStorage`.
- [src/screens/ListaFichasScreen.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/screens/ListaFichasScreen.tsx) — Tela inicial com todas as fichas salvas no aparelho.
- [src/screens/FichaDetalheScreen.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/screens/FichaDetalheScreen.tsx) — Container da ficha com barra superior de resumo (`Nível`, `PV`, `PM`, `CA`) e as 4 abas na sequência pedida:
  1. [src/components/AbaDadosEAtributos.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/components/AbaDadosEAtributos.tsx) — Dados Cadastrais → Atributos Principais (`FOR`, `DES`, `CON`, `INT`, `SAB`, `CAR`) com modificadores ao lado → `PV`, `PM`, `BBA`, `Nível` → `CA` (`10 + 1/2 nível + mod_des + armadura + escudo + tamanho + outros`).
  2. [src/components/AbaPericias.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/components/AbaPericias.tsx) — Lista de todas as perícias com checkbox de **Treinado** e campo manual de **Outros Bônus**, calculando automaticamente `Graduação + Mod. de Habilidade + Outros` (sem penalidade de armadura).
  3. [src/components/AbaHabilidadesEMagias.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/components/AbaHabilidadesEMagias.tsx) — Habilidades de Raça, Habilidades de Classe, Talentos e Magias divididas por nível (`0º ao 9º nível`).
  4. [src/components/AbaEquipamentos.tsx](file:///c:/Users/lorenzo.tochetto/Projetos/ficha_tormenta_android/src/components/AbaEquipamentos.tsx) — Armas, Armaduras/Escudos equipados (cujos bônus alimentam automaticamente o cálculo da CA) e Mochila/Tibares.
