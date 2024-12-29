import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Button, Dialog, PaperProvider, Portal, Avatar } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
      router.replace("/auth/LoginScreen");
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setDialogVisible(true);
    }
  };

  return (
    <PaperProvider>
      <ImageBackground
        source={require("../../assets/images/gambar3.jpg")}
        style={styles.background}
        resizeMode="cover" // Ensures the image covers the area without stretching
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join us and get started</Text>
          <View style={styles.inputContainer}>
            <Avatar.Icon size={24} icon="account" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>
          <View style={styles.inputContainer}>
            <Avatar.Icon size={24} icon="email" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.inputContainer}>
            <Avatar.Icon size={24} icon="lock" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <Button mode="contained" onPress={handleRegister} style={styles.registerButton} icon="account-plus">
            Register
          </Button>
          <Button mode="outlined" onPress={() => router.push("/auth/LoginScreen")} style={styles.loginButton}>
            Already have an account? Login
          </Button>
        </View>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Registration Failed</Dialog.Title>
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
}

const styles = StyleSheet.create({
  background: {
    width: "100%", // Set fixed width
    height: 600, // Set fixed height
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background for better text visibility
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#FF6F61",
  },
  loginButton: {
    marginTop: 16,
    width: "100%",
    borderColor: "#FF6F61",
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
