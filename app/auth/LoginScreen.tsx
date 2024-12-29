import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";
import { MaterialIcons } from '@expo/vector-icons'; // Import ikon

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      const { token } = response.data.data;
      await AsyncStorage.setItem("token", token);
      setDialogMessage("Login successful!");
      setIsSuccess(true);
      setDialogVisible(true);
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setIsSuccess(false);
      setDialogVisible(true);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.replace("/(tabs)");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ImageBackground source={require("../../assets/images/gambar3.jpg")} style={styles.background}>
          <View style={styles.overlay}>
            <Image source={require("../../assets/images/logo1.jpg")} style={styles.logo} />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to continue</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={24} color="#FF6F61" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="#FF6F61" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
              <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
            <Dialog.Title>{isSuccess ? "Success" : "Login Failed"}</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDialogDismiss}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    padding: 20,
    borderRadius: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: "contain",
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 24,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
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
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6F61",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderColor: "#FF6F61",
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FF6F61",
    fontSize: 16,
    fontWeight: "600",
  },
  dialogText: {
    color: "#ffffff",
  },
});
