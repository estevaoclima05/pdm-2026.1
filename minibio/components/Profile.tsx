import { View, Text, Image, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      
      <Image
        source={{ uri: "https://i.imgur.com/aMUgMm1.jpeg" }}
        style={styles.image}
      />

      <Text style={styles.name}>Estevão Lima</Text>

      <Text style={styles.bio}>
        Atualmente, estou cursando Sistemas para Internet na Universidade Católica de Pernambuco 
        e atuo como Analista de Inteligência Comercial na Heineken,
        onde aplico minhas habilidades em análise de dados para apoiar decisões estratégicas na área comercial.
      </Text>

      <Text style={styles.bio}>
        Minha experiência profissional em vendas contribuiu e continua a contribuir para o desenvolvimento das
        minhas habilidades analíticas e comunicativas,
        proporcionando uma visão ampla das necessidades do negócio e da importância dos dados na tomada de decisões.
      </Text>

      <Text style={styles.bio}>
        Estou sempre em busca de aprender mais sobre tecnologias, vendas e de como alinhar esses dois mundos para gerar valor.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    padding: 20,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  bio: {
    fontSize: 16,
    textAlign: "center",
  },
});