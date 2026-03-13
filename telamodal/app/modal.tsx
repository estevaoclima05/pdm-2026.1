import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Stack } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.overlay}>
      <Stack.Screen options={{ title: "Contato" }} />

      <View style={styles.modalBox}>
        <Text style={styles.title}>Contato</Text>

        <Pressable
          onPress={() =>
            Linking.openURL("https://github.com/estevaoclima05")
          }
        >
          <Text style={styles.link}>GitHub</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Linking.openURL(
              "https://www.linkedin.com/in/estev%C3%A3o-lima-510152219/"
            )
          }
        >
          <Text style={styles.link}>LinkedIn</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Linking.openURL("mailto:estevao.00000855153@unicap.br")
          }
        >
          <Text style={styles.link}>Email</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  link: {
    fontSize: 18,
    marginVertical: 8,
    color: "#007AFF",
  },
});