import React, { useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  View 
} from 'react-native';
import { 
  Appbar, 
  Avatar, 
  Button, 
  Card, 
  Text, 
  TextInput, 
  List, 
  Switch, 
  ProgressBar, 
  Chip,
  DataTable,
  SegmentedButtons,
  useTheme,
  FAB
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [value, setValue] = useState('perfil');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <Appbar.Header elevated>
          <Appbar.Action icon="menu" onPress={() => {}} />
          <Appbar.Content title="Meu App" />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              { value: 'perfil', label: 'Perfil', icon: 'account' },
              { value: 'dados', label: 'Dados', icon: 'database' },
              { value: 'config', label: 'Ajustes', icon: 'cog' },
            ]}
            style={styles.segmented}
          />

          <View style={styles.headerSection}>
            <Avatar.Image 
              size={100} 
              source={{ uri: 'https://preview.redd.it/sabe-muito-v0-oh1sn71030xe1.jpeg?width=479&format=pjpg&auto=webp&s=aa402e4f76bba2d324ba921e3ac0385ab195dea8' }} 
            />
            <Text variant="headlineMedium" style={styles.userName}>Estevão Chagas</Text>
            <View style={styles.chipRow}>
              <Chip mode="flat" selectedColor={theme.colors.primary}>Premium</Chip>
              <Chip icon="check-decagram">Verificado</Chip>
            </View>
          </View>

          <Text variant="titleMedium" style={styles.sectionLabel}>Estatísticas de Uso</Text>
          <Card style={styles.card} mode="contained">
            <Card.Content>
              <Text variant="bodySmall">Armazenamento Utilizado (25%)</Text>
              <ProgressBar progress={0.25} color={theme.colors.error} style={styles.progress} />
              
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Projeto</DataTable.Title>
                  <DataTable.Title numeric>Status</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell>Mobile App</DataTable.Cell>
                  <DataTable.Cell numeric>Ativo</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>API Backend</DataTable.Cell>
                  <DataTable.Cell numeric>Pendente</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </Card.Content>
          </Card>

          <Text variant="titleMedium" style={styles.sectionLabel}>Preferências</Text>
          <Card style={styles.card} mode="outlined">
            <List.Item
              title="Notificações em tempo real"
              description="Receba alertas de novos projetos"
              left={props => <List.Icon {...props} icon="bell-outline" />}
              right={() => <Switch value={isNotificationsEnabled} onValueChange={setIsNotificationsEnabled} />}
            />
          </Card>

          <TextInput
            label="Feedback Rápido"
            placeholder="O que você está achando?"
            mode="outlined"
            multiline
            style={styles.input}
          />
          
          <Button 
            mode="contained" 
            onPress={() => {}} 
            style={styles.mainButton}
            contentStyle={{ height: 50 }}
          >
            Sincronizar Dados
          </Button>

        </ScrollView>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => console.log('Adicionar novo item')}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  segmented: {
    marginBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  sectionLabel: {
    marginBottom: 8,
    opacity: 0.7,
    fontWeight: '600',
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  progress: {
    height: 6,
    borderRadius: 3,
    marginVertical: 12,
  },
  input: {
    marginBottom: 16,
  },
  mainButton: {
    borderRadius: 8,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});