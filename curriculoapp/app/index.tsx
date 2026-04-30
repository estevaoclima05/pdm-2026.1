import { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import {
  Text, Card, Button, Portal, Modal, TextInput,
  ActivityIndicator, Snackbar, Avatar, Chip, Divider,
  IconButton, TouchableRipple,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUsuarios, criarUsuario, atualizarUsuario, deletarUsuario } from "../api";
import { C } from "../constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", bio: "" });

  const { data: usuarios = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });

  const criarMutation = useMutation({
    mutationFn: criarUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); setModalVisible(false); showSnack("Usuário criado com sucesso!"); },
    onError: () => showSnack("Erro ao criar usuário"),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: any }) => atualizarUsuario(id, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); setModalVisible(false); showSnack("Usuário atualizado!"); },
    onError: () => showSnack("Erro ao atualizar usuário"),
  });

  const deletarMutation = useMutation({
    mutationFn: deletarUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); showSnack("Usuário removido."); },
    onError: () => showSnack("Erro ao remover usuário"),
  });

  function showSnack(msg: string) { setSnackMsg(msg); setSnackVisible(true); }

  function abrirCriar() {
    setEditando(null);
    setForm({ nome: "", email: "", bio: "" });
    setModalVisible(true);
  }

  function abrirEditar(u: any) {
    setEditando(u);
    setForm({ nome: u.nome, email: u.email, bio: u.bio || "" });
    setModalVisible(true);
  }

  function salvar() {
    if (!form.nome.trim() || !form.email.trim()) { showSnack("Nome e e-mail são obrigatórios"); return; }
    if (editando) {
      atualizarMutation.mutate({ id: editando._id || editando.id, dados: form });
    } else {
      criarMutation.mutate(form);
    }
  }

  function confirmarDeletar(u: any) {
    Alert.alert("Remover usuário", `Deseja remover "${u.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => deletarMutation.mutate(u._id || u.id) },
    ]);
  }

  function getIniciais(nome: string) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  }

  const isSaving = criarMutation.isPending || atualizarMutation.isPending;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Currículo App</Text>
          <Text style={styles.headerSub}>AOS 2026</Text>
        </View>
        <IconButton
          icon="information-outline"
          iconColor={C.headerText}
          size={24}
          onPress={() => router.push("/sobre")}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={C.primary} style={styles.centered} />
        ) : isError ? (
          <View style={styles.emptyBox}>
            <IconButton icon="wifi-off" size={40} iconColor={C.textMuted} />
            <Text style={styles.emptyTitle}>Falha na conexão</Text>
            <Text style={styles.emptySub}>Verifique sua internet e tente novamente</Text>
            <Button mode="outlined" onPress={() => refetch()} textColor={C.primary} style={styles.retryBtn}>
              Tentar novamente
            </Button>
          </View>
        ) : usuarios.length === 0 ? (
          <View style={styles.emptyBox}>
            <IconButton icon="account-outline" size={48} iconColor={C.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum usuário</Text>
            <Text style={styles.emptySub}>Toque em "Novo usuário" para começar</Text>
            <Button mode="contained" onPress={abrirCriar} buttonColor={C.primary} style={styles.retryBtn}>
              Novo usuário
            </Button>
          </View>
        ) : (
          <>
            <Text style={styles.countLabel}>
              {usuarios.length} {usuarios.length === 1 ? "usuário" : "usuários"}
            </Text>
            {usuarios.map((u: any) => {
              const id = u._id || u.id;
              return (
                <Card key={id} style={styles.card} elevation={1}>
                  <Card.Content style={styles.cardTop}>
                    <Avatar.Text
                      size={44}
                      label={getIniciais(u.nome)}
                      style={{ backgroundColor: C.primary }}
                      color="#fff"
                    />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{u.nome}</Text>
                      <Text style={styles.cardEmail}>{u.email}</Text>
                      {u.bio ? <Text style={styles.cardBio}>{u.bio}</Text> : null}
                    </View>
                  </Card.Content>

                  <View style={styles.chipRow}>
                    <Chip
                      
                      onPress={() => router.push(`/usuario/${id}/curriculo`)}
                      style={styles.chipPrimary}
                      textStyle={styles.chipPrimaryText}
                      compact
                    >
                      Currículo
                    </Chip>
                    <Chip
                      icon="school-outline"
                      onPress={() => router.push(`/usuario/${id}/academica`)}
                      style={styles.chipOutline}
                      textStyle={styles.chipOutlineText}
                      compact
                    >
                      Acadêmica
                    </Chip>
                    <Chip
                      icon="briefcase-outline"
                      onPress={() => router.push(`/usuario/${id}/profissional`)}
                      style={styles.chipOutline}
                      textStyle={styles.chipOutlineText}
                      compact
                    >
                      Profissional
                    </Chip>
                    <Chip
                      icon="code-tags"
                      onPress={() => router.push(`/usuario/${id}/projetos`)}
                      style={styles.chipOutline}
                      textStyle={styles.chipOutlineText}
                      compact
                    >
                      Projetos
                    </Chip>
                  </View>

                  <Divider style={styles.divider} />

                  <Card.Actions style={styles.cardActions}>
                    <Button
                      icon="pencil-outline"
                      mode="text"
                      onPress={() => abrirEditar(u)}
                      textColor={C.primary}
                      compact
                    >
                      Editar
                    </Button>
                    <Button
                      icon="trash-can-outline"
                      mode="text"
                      onPress={() => confirmarDeletar(u)}
                      textColor={C.danger}
                      compact
                    >
                      Remover
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })}
          </>
        )}

        {!isLoading && !isError && usuarios.length > 0 && (
          <Button
            mode="contained"
            icon="plus"
            onPress={abrirCriar}
            buttonColor={C.primary}
            style={styles.addBtn}
            contentStyle={styles.addBtnContent}
          >
            Novo usuário
          </Button>
        )}

        <View style={styles.scrollFooter} />
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalWrapper}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>
                {editando ? "Editar usuário" : "Novo usuário"}
              </Text>

              <TextInput
                label="Nome *"
                value={form.nome}
                onChangeText={(v) => setForm({ ...form, nome: v })}
                mode="outlined"
                style={styles.input}
                outlineColor={C.border}
                activeOutlineColor={C.primary}
              />
              <TextInput
                label="E-mail *"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor={C.border}
                activeOutlineColor={C.primary}
              />
              <TextInput
                label="Bio"
                value={form.bio}
                onChangeText={(v) => setForm({ ...form, bio: v })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                outlineColor={C.border}
                activeOutlineColor={C.primary}
              />

              <View style={styles.modalActions}>
                <Button onPress={() => setModalVisible(false)} textColor={C.textSecondary} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={salvar} buttonColor={C.primary} loading={isSaving} disabled={isSaving}>
                  Salvar
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={3000}>
        {snackMsg}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.headerBg },

  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: C.headerText, fontSize: 20, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 1 },

  scroll: { padding: 16, backgroundColor: C.bg },
  scrollFooter: { height: 32 },

  centered: { marginTop: 72 },

  emptyBox: { alignItems: "center", paddingTop: 72, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: C.textPrimary, marginTop: 4 },
  emptySub: { fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 6, lineHeight: 18 },
  retryBtn: { marginTop: 20, borderRadius: 8 },

  countLabel: { fontSize: 12, color: C.textMuted, marginBottom: 12, marginLeft: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  card: { marginBottom: 14, borderRadius: 14, backgroundColor: C.surface },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "700", color: C.textPrimary },
  cardEmail: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  cardBio: { fontSize: 12, color: C.textMuted, marginTop: 4, fontStyle: "italic" },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 16, paddingBottom: 12 },
  chipPrimary: { backgroundColor: C.primary },
  chipPrimaryText: { color: "#fff", fontSize: 11 },
  chipOutline: { backgroundColor: C.primaryLight },
  chipOutlineText: { color: C.primary, fontSize: 11 },

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