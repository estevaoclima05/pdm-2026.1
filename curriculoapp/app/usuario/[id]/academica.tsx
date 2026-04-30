import { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import {
  Text, Card, Button, Portal, Modal, TextInput,
  ActivityIndicator, Snackbar, Avatar, Divider, IconButton,
} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAcademicas, criarAcademica, atualizarAcademica,
  deletarAcademica, getUsuario,
} from "../../../api";
import { C } from "../../../constants/colors";

export default function AcademicaScreen() {
  const { id: usuarioId } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [form, setForm] = useState({ instituicao: "", curso: "", periodo: "" });

  const { data: usuario } = useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () => getUsuario(usuarioId),
  });

  const { data: academicas = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["academicas", usuarioId],
    queryFn: () => getAcademicas(usuarioId),
  });

  const criarMutation = useMutation({
    mutationFn: (dados: any) => criarAcademica(usuarioId, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["academicas", usuarioId] }); setModalVisible(false); showSnack("Formação adicionada!"); },
    onError: () => showSnack("Erro ao adicionar"),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ itemId, dados }: { itemId: string; dados: any }) => atualizarAcademica(usuarioId, itemId, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["academicas", usuarioId] }); setModalVisible(false); showSnack("Formação atualizada!"); },
    onError: () => showSnack("Erro ao atualizar"),
  });

  const deletarMutation = useMutation({
    mutationFn: (itemId: string) => deletarAcademica(usuarioId, itemId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["academicas", usuarioId] }); showSnack("Formação removida."); },
    onError: () => showSnack("Erro ao remover"),
  });

  function showSnack(msg: string) { setSnackMsg(msg); setSnackVisible(true); }

  function abrirCriar() {
    setEditando(null);
    setForm({ instituicao: "", curso: "", periodo: "" });
    setModalVisible(true);
  }

  function abrirEditar(item: any) {
    setEditando(item);
    setForm({ instituicao: item.instituicao, curso: item.curso, periodo: item.periodo || "" });
    setModalVisible(true);
  }

  function salvar() {
    if (!form.instituicao.trim() || !form.curso.trim()) { showSnack("Instituição e curso são obrigatórios"); return; }
    if (editando) {
      atualizarMutation.mutate({ itemId: editando._id || editando.id, dados: form });
    } else {
      criarMutation.mutate(form);
    }
  }

  function confirmarDeletar(item: any) {
    Alert.alert("Remover formação", `Remover "${item.curso}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => deletarMutation.mutate(item._id || item.id) },
    ]);
  }

  const isSaving = criarMutation.isPending || atualizarMutation.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      {usuario && (
        <View style={styles.banner}>
          <Avatar.Text
            size={34}
            label={usuario.nome?.slice(0, 2).toUpperCase()}
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            color="#fff"
          />
          <View>
            <Text style={styles.bannerName}>{usuario.nome}</Text>
            <Text style={styles.bannerSub}>Formação acadêmica</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {isLoading ? (
          <ActivityIndicator size="large" color={C.primary} style={styles.centered} />
        ) : isError ? (
          <View style={styles.emptyBox}>
            <IconButton icon="wifi-off" size={36} iconColor={C.textMuted} />
            <Text style={styles.emptyTitle}>Falha ao carregar</Text>
            <Button mode="outlined" onPress={() => refetch()} textColor={C.primary} style={{ marginTop: 14 }}>Tentar novamente</Button>
          </View>
        ) : academicas.length === 0 ? (
          <View style={styles.emptyBox}>
            <IconButton icon="school-outline" size={48} iconColor={C.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma formação</Text>
            <Text style={styles.emptySub}>Adicione sua formação acadêmica</Text>
            <Button mode="contained" onPress={abrirCriar} buttonColor={C.primary} style={{ marginTop: 16, borderRadius: 8 }}>
              Adicionar formação
            </Button>
          </View>
        ) : (
          <>
            <Text style={styles.countLabel}>
              {academicas.length} {academicas.length === 1 ? "formação" : "formações"}
            </Text>
            {academicas.map((item: any) => (
              <Card key={item._id || item.id} style={styles.card} elevation={1}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.accent} />
                  <View style={styles.cardBody}>
                    <Text style={styles.curso}>{item.curso}</Text>
                    <Text style={styles.instituicao}>{item.instituicao}</Text>
                    {item.periodo ? (
                      <View style={styles.periodRow}>
                        <IconButton icon="calendar-outline" size={13} iconColor={C.textMuted} style={styles.periodIcon} />
                        <Text style={styles.periodo}>{item.periodo}</Text>
                      </View>
                    ) : null}
                  </View>
                </Card.Content>
                <Divider style={styles.divider} />
                <Card.Actions style={styles.cardActions}>
                  <Button icon="pencil-outline" mode="text" onPress={() => abrirEditar(item)} textColor={C.primary} compact>Editar</Button>
                  <Button icon="trash-can-outline" mode="text" onPress={() => confirmarDeletar(item)} textColor={C.danger} compact>Remover</Button>
                </Card.Actions>
              </Card>
            ))}
            <Button mode="contained" icon="plus" onPress={abrirCriar} buttonColor={C.primary} style={styles.addBtn} contentStyle={styles.addBtnContent}>
              Adicionar formação
            </Button>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalWrapper}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{editando ? "Editar formação" : "Nova formação"}</Text>
              <TextInput label="Instituição *" value={form.instituicao} onChangeText={(v) => setForm({ ...form, instituicao: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="Curso *" value={form.curso} onChangeText={(v) => setForm({ ...form, curso: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="Período (ex: 2020-2024)" value={form.periodo} onChangeText={(v) => setForm({ ...form, periodo: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <View style={styles.modalActions}>
                <Button onPress={() => setModalVisible(false)} textColor={C.textSecondary} disabled={isSaving}>Cancelar</Button>
                <Button mode="contained" onPress={salvar} buttonColor={C.primary} loading={isSaving} disabled={isSaving}>Salvar</Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={3000}>{snackMsg}</Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  banner: { backgroundColor: C.primary, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 14 },
  bannerName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  bannerSub: { color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 1 },
  scroll: { padding: 16 },
  centered: { marginTop: 72 },
  emptyBox: { alignItems: "center", paddingTop: 64, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: C.textPrimary, marginTop: 4 },
  emptySub: { fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 6 },
  countLabel: { fontSize: 12, color: C.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  card: { marginBottom: 12, borderRadius: 14, backgroundColor: C.surface },
  cardContent: { flexDirection: "row", gap: 14, paddingBottom: 8 },
  accent: { width: 4, borderRadius: 4, backgroundColor: C.primary, alignSelf: "stretch" },
  cardBody: { flex: 1 },
  curso: { fontSize: 15, fontWeight: "700", color: C.textPrimary },
  instituicao: { fontSize: 13, color: C.primary, marginTop: 3 },
  periodRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  periodIcon: { margin: 0, padding: 0 },
  periodo: { fontSize: 12, color: C.textMuted },
  divider: { backgroundColor: C.border },
  cardActions: { paddingHorizontal: 4, paddingVertical: 2 },
  addBtn: { marginTop: 8, borderRadius: 10 },
  addBtnContent: { paddingVertical: 4 },
  modalWrapper: { margin: 24 },
  modal: { backgroundColor: C.surface, borderRadius: 18, padding: 24 },
  modalTitle: { fontSize: 17, fontWeight: "700", color: C.textPrimary, marginBottom: 18 },
  input: { marginBottom: 12, backgroundColor: C.surface },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 },
});