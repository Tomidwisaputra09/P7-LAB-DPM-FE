import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground } from "react-native";
import { ActivityIndicator, Button, Card, Dialog, FAB, Portal, Provider as PaperProvider, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTodos } from "@/context/TodoContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "@/config/config";

const TodosScreen = () => {
  const { todos, fetchTodos } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      await fetchTodos();
      setLoading(false);
    };
    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title || !description) {
      setDialogMessage("Both title and description are required.");
      setDialogVisible(true);
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/todos`,
        {
          title,
          description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos();
      setTitle("");
      setDescription("");
      setIsAdding(false);
    } catch (error) {
      setDialogMessage("Failed to add todo");
      setDialogVisible(true);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTodos();
    } catch (error) {
      setDialogMessage("Failed to delete todo");
      setDialogVisible(true);
    }
  };

  return (
    <PaperProvider>
      <ImageBackground source={require("../../assets/images/gambar3.jpg")} style={styles.background}>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.title}>ToDo List</Text>
              {loading && <ActivityIndicator style={styles.loading} animating={true} />}
            </>
          }
          data={todos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card} elevation={5}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button icon="delete" textColor="#d32f2f" onPress={() => handleDeleteTodo(item._id)}>
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          )}
          contentContainerStyle={styles.listContainer}
        />
        {isAdding && (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inputContainer}>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
              textColor="black" // Set text color to black
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              textColor="black" // Set text color to black
            />
            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>
              Add Todo
            </Button>
            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>
              Cancel
            </Button>
          </KeyboardAvoidingView>
        )}
        {!isAdding && <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} />}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
    backgroundColor: "#f0f8ff",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1e88e5",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: "#616161",
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: "#9e9e9e",
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#ffffff",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    height: 50,
    paddingLeft: 16,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: "#FF6F61",
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: "#FF6F61",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#FF6F61",
  },
  loading: {
    marginTop: 16,
  },
});

export default TodosScreen;
