import { ScrollView, StyleSheet, View, Linking } from "react-native";
import { Text, Card, Chip, Divider, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C } from "../constants/colors";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TECNOLOGIAS: { nome: string; desc: string; icon: IconName }[] = [
  { nome: "React Native", desc: "Framework mobile multiplataforma", icon: "react" },
  { nome: "Expo", desc: "Plataforma de desenvolvimento React Native", icon: "rocket-launch-outline" },
  { nome: "Expo Router", desc: "Navegação file-based (v4)", icon: "sitemap-outline" },
  { nome: "React Native Paper", desc: "UI Kit com Material Design 3", icon: "palette-outline" },
  { nome: "TanStack Query", desc: "Cache e sincronização de dados do servidor", icon: "database-sync-outline" },
  { nome: "Axios", desc: "Cliente HTTP para consumo da API REST", icon: "api" },
  { nome: "TypeScript", desc: "Tipagem estática para JavaScript", icon: "language-typescript" },
];

const TELAS: { nome: string; desc: string; extra?: boolean }[] = [
  { nome: "Home", desc: "Lista e gerenciamento de usuários com CRUD completo" },
  { nome: "Sobre", desc: "Informações sobre o app, tecnologias e funcionalidade extra" },
  { nome: "Experiência Acadêmica", desc: "Gerenciamento da formação acadêmica do usuário" },
  { nome: "Experiência Profissional", desc: "Gerenciamento do histórico profissional" },
  { nome: "Projetos", desc: "Gerenciamento dos projetos desenvolvidos" },
  { nome: "Currículo Completo", desc: "Visualização unificada de todo o currículo em uma única tela", extra: true },
];

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>

        <Surface style={styles.banner} elevation={0}>
          <View style={styles.bannerIcon}>
            <MaterialCommunityIcons name="file-account-outline" size={36} color="#fff" />
          </View>
          <Text style={styles.bannerTitle}>Currículo App</Text>
          <Text style={styles.bannerVersion}>v1.0.0 — AOS 2026</Text>
          <Text style={styles.bannerDesc}>
            Aplicativo mobile para gerenciamento de currículos profissionais,
            consumindo a API Currículo AOS 2026 hospedada na Vercel.
          </Text>
        </Surface>

        <Text style={styles.sectionLabel}>Tecnologias utilizadas</Text>
        <Card style={styles.card}>
          <Card.Content style={{ paddingHorizontal: 0 }}>
            {TECNOLOGIAS.map((t, i) => (
              <View key={t.nome}>
                <View style={styles.techRow}>
                  <View style={styles.techIconWrap}>
                    <MaterialCommunityIcons name={t.icon} size={20} color={C.primary} />
                  </View>
                  <View style={styles.techInfo}>
                    <Text style={styles.techNome}>{t.nome}</Text>
                    <Text style={styles.techDesc}>{t.desc}</Text>
                  </View>
                </View>
                {i < TECNOLOGIAS.length - 1 && <Divider style={styles.innerDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Text style={styles.sectionLabel}>Telas do aplicativo</Text>
        <Card style={styles.card}>
          <Card.Content style={{ paddingHorizontal: 0 }}>
            {TELAS.map((t, i) => (
              <View key={t.nome}>
                <View style={styles.telaRow}>
                  <View style={styles.telaLeft}>
                    <View style={[styles.telaDot, t.extra && styles.telaDotExtra]} />
                  </View>
                  <View style={styles.telaInfo}>
                    <View style={styles.telaNameRow}>
                      <Text style={styles.telaNome}>{t.nome}</Text>
                    </View>
                    <Text style={styles.telaDesc}>{t.desc}</Text>
                  </View>
                </View>
                {i < TELAS.length - 1 && <Divider style={styles.innerDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Text style={styles.sectionLabel}>Funcionalidade extra</Text>
        <Card style={styles.cardExtra}>
          <Card.Content>
            <Text style={styles.extraTitle}>Currículo Visual Completo</Text>
            <Text style={styles.extraDesc}>
              Tela dedicada que reúne em uma única visualização toda a informação
              do currículo: perfil, formações acadêmicas, experiências profissionais
              e projetos — com estatísticas e layout de timeline.
            </Text>
            <View style={styles.extraChips}>
              <Chip icon="eye-outline" style={styles.featureChip}>Visualização unificada</Chip>
              <Chip icon="lightning-bolt-outline" style={styles.featureChip}>Cache instantâneo</Chip>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionLabel}>Back-end</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.apiLabel}>URL base</Text>
            <Text
              style={styles.apiUrl}
              onPress={() => Linking.openURL("https://curriculo-api-aos-2026.vercel.app/api")}
            >
              curriculo-api-aos-2026.vercel.app/api
            </Text>
            <Divider style={[styles.innerDivider, { marginVertical: 12 }]} />
            <Text style={styles.techDesc}>
              API RESTful desenvolvida para a disciplina AOS 2026, hospedada na Vercel.
              Recursos: usuários, experiências acadêmicas, profissionais e projetos.
            </Text>
          </Card.Content>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16 },

  banner: {
    backgroundColor: C.primary,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 14 },
  bannerVersion: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
  bannerDesc: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  card: { borderRadius: 14, backgroundColor: C.surface, marginBottom: 20 },
  cardExtra: {
    borderRadius: 14,
    backgroundColor: C.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    marginBottom: 20,
  },

  techRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 12 },
  techIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  techInfo: { flex: 1 },
  techNome: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  techDesc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  innerDivider: { backgroundColor: C.border, marginHorizontal: 16 },

  telaRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  telaLeft: { paddingTop: 5 },
  telaDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  telaDotExtra: { backgroundColor: C.accent },
  telaInfo: { flex: 1 },
  telaNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  telaNome: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  telaDesc: { fontSize: 12, color: C.textSecondary, marginTop: 3, lineHeight: 18 },

  extraTitle: { fontSize: 15, fontWeight: "700", color: C.primary, marginBottom: 8 },
  extraDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 20 },
  extraChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  featureChip: { backgroundColor: C.surface },

  apiLabel: { fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  apiUrl: { fontSize: 13, color: C.primary, fontWeight: "600", textDecorationLine: "underline" },
});