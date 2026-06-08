## 👥 Integrantes

| Nome completo            | RM       |
|--------------------------|----------|
| Daniel Castro Sanches   | RM-563333 |
| Maria Eduarda de Áquila Amaral  | RM-563783 |
| Matheus Vilela Silveira  | RM-564989 |
---




# 🛰️ Central de Monitoramento de Missões Espaciais

Aplicativo mobile **cross-platform** (iOS / Android / Web) desenvolvido em
**React Native + Expo** que simula a central de controle de uma missão espacial.
O app reúne, em um painel temático e em tempo real, a telemetria dos principais
subsistemas de uma espaçonave, gera alertas automáticos em condições críticas e
permite a configuração e atualização manual dos dados da missão.

> Disciplina: **Cross-Platform Application Development**

---

## 🚀 Funcionalidades

- **Dashboards de telemetria** com dados de **sensores**, **energia**,
  **comunicação** e **estabilidade orbital**, cada métrica exibida em um medidor
  (gauge) colorido por status (nominal / atenção / crítico).
- **Alertas automáticos** disparados quando um parâmetro atinge níveis críticos
  ou sai da faixa nominal — com histórico, filtros, "marcar como lido" e badge de
  não lidos na navegação.
- **Simulação ao vivo**: a telemetria é atualizada periodicamente (intervalo
  configurável) por um motor de *random walk*; um botão **"Simular anomalia"**
  força uma condição crítica para demonstrar o sistema de alertas.
- **Formulários com validação**:
  - Configuração da missão (nome, código, comandante, tripulação, data de
    lançamento, órbita-alvo) com validação de campos obrigatórios, formato do
    código (`AAA-000`), formato de data ISO e limites numéricos.
  - Atualização manual de qualquer métrica com validação de faixa.
- **Navegação com Expo Router** usando abas + telas modais.
- **Persistência local com AsyncStorage**: missão, telemetria, alertas e
  preferências sobrevivem ao fechamento do app.
- **Estado global com Context API** (`MissionContext`) compartilhado entre todas
  as telas.
- **Design temático espacial**: fundo profundo, acentos neon e cores semânticas
  de status.

---

## 🧱 Tecnologias e requisitos atendidos

| Requisito técnico            | Implementação |
|------------------------------|---------------|
| Context API (estado global)  | [`context/MissionContext.tsx`](context/MissionContext.tsx) + hook `useMission` |
| Persistência (AsyncStorage)  | [`utils/storage.ts`](utils/storage.ts) |
| Roteamento (Expo Router)     | [`app/`](app/) — abas em `app/(tabs)` e modais |
| Formulários com validação    | [`utils/validation.ts`](utils/validation.ts), [`app/mission-setup.tsx`](app/mission-setup.tsx), [`app/metric-edit.tsx`](app/metric-edit.tsx) |
| Dashboards / sensores        | [`app/(tabs)/index.tsx`](app/(tabs)/index.tsx), [`app/(tabs)/telemetry.tsx`](app/(tabs)/telemetry.tsx) |
| Alertas automáticos          | [`app/(tabs)/alerts.tsx`](app/(tabs)/alerts.tsx) + lógica em `MissionContext` |
| Design temático              | [`theme/index.ts`](theme/index.ts) e componentes em [`components/`](components/) |

**Stack:** React Native 0.76 · Expo SDK 52 · Expo Router 4 · TypeScript ·
`@react-native-async-storage/async-storage` · `@expo/vector-icons`.

---

## 📂 Estrutura do projeto

```
.
├── app/                       # Rotas (Expo Router)
│   ├── _layout.tsx            # Layout raiz + MissionProvider + Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Navegação por abas (badge de alertas)
│   │   ├── index.tsx          # Painel / Centro de Controle
│   │   ├── telemetry.tsx      # Telemetria detalhada por subsistema
│   │   ├── alerts.tsx         # Lista e filtros de alertas
│   │   └── settings.tsx       # Configurações + missão atual
│   ├── mission-setup.tsx      # Formulário (modal) de configuração da missão
│   └── metric-edit.tsx        # Formulário (modal) de leitura manual de métrica
├── components/                # Componentes reutilizáveis (UI)
├── context/                   # Context API (estado global da missão)
├── theme/                     # Paleta, espaçamentos e helpers de status
├── types/                     # Tipos TypeScript compartilhados
└── utils/                     # storage, validação, simulação, status, defaults
```

---

## ▶️ Como executar

Pré-requisitos: **Node.js 18+** e o app **Expo Go** (no celular) ou um emulador.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start
```

Em seguida:

- Pressione **`a`** para abrir no Android, **`i`** no iOS, ou **`w`** no navegador.
- Ou escaneie o QR Code com o app **Expo Go**.

> Dica: se houver divergência de versões de pacotes, rode `npx expo install`
> para alinhar as dependências à versão do SDK.

Verificação de tipos:

```bash
npm run typecheck
```

---

## 🎮 Como usar / roteiro de demonstração

1. Na aba **Painel**, observe o status geral e os cartões dos quatro subsistemas
   atualizando em tempo real.
2. Toque em **"Simular anomalia"** para forçar uma métrica a um valor crítico —
   um alerta aparece e o badge da aba **Alertas** incrementa.
3. Abra a aba **Telemetria** e toque em qualquer medidor para inserir uma
   **leitura manual** (com validação de faixa).
4. Em **Alertas**, filtre por severidade e use "marcar como lido" / "limpar".
5. Em **Configurações**, edite os dados da missão (formulário validado), ajuste o
   intervalo de atualização ou restaure os padrões.
6. Feche e reabra o app: os dados persistem (AsyncStorage).

---
