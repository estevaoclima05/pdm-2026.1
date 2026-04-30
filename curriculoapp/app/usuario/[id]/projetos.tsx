import { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert, Linking,
  KeyboardAvoidingView, Platform,
} from "react-native";
import {
  Text, Card, Button, Portal, Modal, TextInput,
  ActivityIndicator, Snackbar, Avatar, Divider, Chip, IconButton,
} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getProjetos, criarProjeto, atualizarProjeto,
  deletarProjeto, getUsuario,
} from "../../../api";
import { C } from "../../../constants/colors";

export default function ProjetosScreen() {
  const { id: usuarioId } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [form, setForm] = useState({ nome: "", tecnologias: "", link: "" });

  const { data: usuario } = useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () => getUsuario(usuarioId),
  });

  const { data: projetos = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["projetos", usuarioId],
    queryFn: () => getProjetos(usuarioId),
  });

  const criarMutation = useMutation({
    mutationFn: (dados: any) => criarProjeto(usuarioId, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["projetos", usuarioId] }); setModalVisible(false); showSnack("Projeto adicionado!"); },
    onError: () => showSnack("Erro ao adicionar"),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ itemId, dados }: { itemId: string; dados: any }) => atualizarProjeto(usuarioId, itemId, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["projetos", usuarioId] }); setModalVisible(false); showSnack("Projeto atualizado!"); },
    onError: () => showSnack("Erro ao atualizar"),
  });

  const deletarMutation = useMutation({
    mutationFn: (itemId: string) => deletarProjeto(usuarioId, itemId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["projetos", usuarioId] }); showSnack("Projeto removido."); },
    onError: () => showSnack("Erro ao remover"),
  });

  function showSnack(msg: string) { setSnackMsg(msg); setSnackVisible(true); }

  function abrirCriar() {
    setEditando(null);
    setForm({ nome: "", tecnologias: "", link: "" });
    setModalVisible(true);
  }

  function abrirEditar(item: any) {
    setEditando(item);
    setForm({ nome: item.nome, tecnologias: item.tecnologias || "", link: item.link || "" });
    setModalVisible(true);
  }

  function salvar() {
    if (!form.nome.trim()) { showSnack("Nome do projeto é obrigatório"); return; }
    if (editando) {
      atualizarMutation.mutate({ itemId: editando._id || editando.id, dados: form });
    } else {
      criarMutation.mutate(form);
    }
  }

  function confirmarDeletar(item: any) {
    Alert.alert("Remover projeto", `Remover "${item.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => deletarMutation.mutate(item._id || item.id) },
    ]);
  }

  function abrirLink(link: string) {
    const url = link.startsWith("http") ? link : `https://${link}`;
    Linking.openURL(url).catch(() => showSnack("Não foi possível abrir o link"));
  }

  function getTags(tecnologias: string): string[] {
    return tecnologias ? tecnologias.split(",").map((t) => t.trim()).filter(Boolean) : [];
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
            <Text style={styles.bannerSub}>Projetos</Text>
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
        ) : projetos.length === 0 ? (
          <View style={styles.emptyBox}>
            <IconButton icon="code-tags" size={48} iconColor={C.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum projeto</Text>
            <Text style={styles.emptySub}>Adicione seus projetos desenvolvidos</Text>
            <Button mode="contained" onPress={abrirCriar} buttonColor={C.primary} style={{ marginTop: 16, borderRadius: 8 }}>
              Adicionar projeto
            </Button>
          </View>
        ) : (
          <>
            <Text style={styles.countLabel}>
              {projetos.length} {projetos.length === 1 ? "projeto" : "projetos"}
            </Text>
            {projetos.map((item: any) => {
              const tags = getTags(item.tecnologias);
              return (
                <Card key={item._id || item.id} style={styles.card} elevation={1}>
                  <Card.Content style={styles.cardContent}>
                    <View style={[styles.accent, { backgroundColor: C.success }]} />
                    <View style={styles.cardBody}>
                      <Text style={styles.nome}>{item.nome}</Text>
                      {tags.length > 0 && (
                        <View style={styles.tags}>
                          {tags.map((tag) => (
                            <Chip key={tag} style={styles.tag} textStyle={styles.tagText} compact>{tag}</Chip>
                          ))}
                        </View>
                      )}
                      {item.link ? (
                        <Button
                          icon="open-in-new"
                          mode="text"
                          onPress={() => abrirLink(item.link)}
                          textColor={C.primary}
                          compact
                          style={styles.linkBtn}
                          contentStyle={styles.linkBtnContent}
                        >
                          {item.link}
                        </Button>
                      ) : null}
                    </View>
                  </Card.Content>
                  <Divider style={styles.divider} />
                  <Card.Actions style={styles.cardActions}>
                    <Button icon="pencil-outline" mode="text" onPress={() => abrirEditar(item)} textColor={C.primary} compact>Editar</Button>
                    <Button icon="trash-can-outline" mode="text" onPress={() => confirmarDeletar(item)} textColor={C.danger} compact>Remover</Button>
                  </Card.Actions>
                </Card>
              );
            })}
            <Button mode="contained" icon="plus" onPress={abrirCriar} buttonColor={C.primary} style={styles.addBtn} contentStyle={styles.addBtnContent}>
              Adicionar projeto
            </Button>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalWrapper}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{editando ? "Editar projeto" : "Novo projeto"}</Text>
              <TextInput label="Nome do projeto *" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="Tecnologias (ex: Node, React, Docker)" value={form.tecnologias} onChangeText={(v) => setForm({ ...form, tecnologias: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="Link (GitHub, site...)" value={form.link} onChangeText={(v) => setForm({ ...form, link: v })} mode="outlined" autoCapitalize="none" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
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
  accent: { width: 4, borderRadius: 4, alignSelf: "stretch" },
  cardBody: { flex: 1 },
  nome: { fontSize: 15, fontWeight: "700", color: C.textPrimary },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { backgroundColor: "#ECFDF5", lineHeight: 14 },
  tagText: { fontSize: 11, color: C.success },
  linkBtn: { marginTop: 4, alignSelf: "flex-start" },
  linkBtnContent: { flexDirection: "row-reverse" },
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