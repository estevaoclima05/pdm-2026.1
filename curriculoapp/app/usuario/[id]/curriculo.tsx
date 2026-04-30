import { ScrollView, StyleSheet, View } from "react-native";
import {
  Text, Card, ActivityIndicator, Avatar, Divider, Chip, Surface, IconButton,
} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getUsuario, getAcademicas, getProfissionais, getProjetos,
} from "../../../api";
import { C } from "../../../constants/colors";

export default function CurriculoScreen() {
  const { id: usuarioId } = useLocalSearchParams<{ id: string }>();

  const { data: usuario, isLoading: loadingUser } = useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () => getUsuario(usuarioId),
  });
  const { data: academicas = [], isLoading: loadingAcad } = useQuery({
    queryKey: ["academicas", usuarioId],
    queryFn: () => getAcademicas(usuarioId),
  });
  const { data: profissionais = [], isLoading: loadingProf } = useQuery({
    queryKey: ["profissionais", usuarioId],
    queryFn: () => getProfissionais(usuarioId),
  });
  const { data: projetos = [], isLoading: loadingProj } = useQuery({
    queryKey: ["projetos", usuarioId],
    queryFn: () => getProjetos(usuarioId),
  });

  const isLoading = loadingUser || loadingAcad || loadingProf || loadingProj;

  function getIniciais(nome: string) {
    return nome?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?";
  }

  function getTags(tecnologias: string): string[] {
    return tecnologias ? tecnologias.split(",").map((t) => t.trim()).filter(Boolean) : [];
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.loadingText}>Carregando currículo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>

        <Surface style={styles.profileCard} elevation={0}>
          <Avatar.Text
            size={72}
            label={getIniciais(usuario?.nome ?? "")}
            style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
            color="#fff"
          />
          <Text style={styles.profileName}>{usuario?.nome}</Text>
          <Text style={styles.profileEmail}>{usuario?.email}</Text>
          {usuario?.bio ? (
            <Text style={styles.profileBio}>{usuario.bio}</Text>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{academicas.length}</Text>
              <Text style={styles.statLabel}>Formações</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{profissionais.length}</Text>
              <Text style={styles.statLabel}>Experiências</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{projetos.length}</Text>
              <Text style={styles.statLabel}>Projetos</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: C.primary }]} />
            <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
          </View>

          {academicas.length === 0 ? (
            <Text style={styles.emptySection}>Nenhuma formação cadastrada</Text>
          ) : (
            academicas.map((item: any, index: number) => (
              <View key={item._id || item.id}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.dot, { backgroundColor: C.primary }]} />
                    {index < academicas.length - 1 && (
                      <View style={[styles.line, { backgroundColor: C.primaryLight }]} />
                    )}
                  </View>
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineTitle}>{item.curso}</Text>
                    <Text style={[styles.timelineSub, { color: C.primary }]}>{item.instituicao}</Text>
                    {item.periodo ? (
                      <View style={styles.periodRow}>
                        <IconButton icon="calendar-outline" size={12} iconColor={C.textMuted} style={styles.periodIcon} />
                        <Text style={styles.timelinePeriod}>{item.periodo}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: C.accent }]} />
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          </View>

          {profissionais.length === 0 ? (
            <Text style={styles.emptySection}>Nenhuma experiência cadastrada</Text>
          ) : (
            profissionais.map((item: any, index: number) => (
              <View key={item._id || item.id}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.dot, { backgroundColor: C.accent }]} />
                    {index < profissionais.length - 1 && (
                      <View style={[styles.line, { backgroundColor: C.accentLight }]} />
                    )}
                  </View>
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineTitle}>{item.cargo}</Text>
                    <Text style={[styles.timelineSub, { color: C.accent }]}>{item.empresa}</Text>
                    {item.descricao ? (
                      <Text style={styles.timelineDesc}>{item.descricao}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: C.success }]} />
            <Text style={styles.sectionTitle}>Projetos</Text>
          </View>

          {projetos.length === 0 ? (
            <Text style={styles.emptySection}>Nenhum projeto cadastrado</Text>
          ) : (
            <View style={styles.projetosGrid}>
              {projetos.map((item: any) => {
                const tags = getTags(item.tecnologias);
                return (
                  <Card key={item._id || item.id} style={styles.projetoCard} elevation={1}>
                    <Card.Content>
                      <View style={styles.projetoHeader}>
                        <View style={[styles.projetoAccent, { backgroundColor: C.success }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.projetoNome}>{item.nome}</Text>
                          {tags.length > 0 && (
                            <View style={styles.tags}>
                              {tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  style={styles.tag}
                                  textStyle={styles.tagText}
                                  compact
                                >
                                  {tag}
                                </Chip>
                              ))}
                            </View>
                          )}
                          {item.link ? (
                            <Text style={styles.projetoLink}>{item.link}</Text>
                          ) : null}
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadingText: { color: C.textSecondary, fontSize: 14 },
  content: { paddingBottom: 24 },

  profileCard: {
    backgroundColor: C.primary,
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  profileName: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 14, textAlign: "center" },
  profileEmail: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  profileBio: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: { color: "#fff", fontSize: 20, fontWeight: "700" },
  statLabel: { color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2 },
  statSep: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.25)" },

  section: { paddingHorizontal: 20, paddingTop: 22 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.textPrimary },
  emptySection: { fontSize: 13, color: C.textMuted, marginLeft: 20 },
  divider: { marginHorizontal: 20, marginTop: 22, backgroundColor: C.border },

  timelineItem: { flexDirection: "row", gap: 14, marginBottom: 4 },
  timelineLeft: { alignItems: "center", width: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  line: { width: 2, flex: 1, marginTop: 4, marginBottom: -4, borderRadius: 1 },
  timelineBody: { flex: 1, paddingBottom: 20 },
  timelineTitle: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
  timelineSub: { fontSize: 13, marginTop: 2, fontWeight: "600" },
  timelinePeriod: { fontSize: 12, color: C.textMuted },
  timelineDesc: { fontSize: 13, color: C.textSecondary, marginTop: 5, lineHeight: 18 },
  periodRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  periodIcon: { margin: 0, padding: 0, marginLeft: -4 },

  projetosGrid: { gap: 10 },
  projetoCard: { borderRadius: 12, backgroundColor: C.surface },
  projetoHeader: { flexDirection: "row", gap: 12 },
  projetoAccent: { width: 4, borderRadius: 4, alignSelf: "stretch" },
  projetoNome: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { backgroundColor: "#ECFDF5" },
  tagText: { fontSize: 10, color: C.success, lineHeight: 14 },
  projetoLink: { fontSize: 11, color: C.primary, marginTop: 6 },
});