import React, { useEffect, useState } from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text, Avatar } from "react-native-paper";
import API_URL from "@/config/config";

type UserProfile = {
  username: string;
  email: string;
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setDialogVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/LoginScreen");
  };

  if (loading) {
    return (
      <PaperProvider>
        <ImageBackground source={require("../../assets/images/gambar3.jpg")} style={styles.background}>
          <ActivityIndicator animating={true} size="large" color="#fff" />
        </ImageBackground>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <ImageBackground source={require("../../assets/images/gambar3.jpg")} style={styles.background}>
        <View style={styles.overlay}>
          {profile ? (
            <View style={styles.card}>
              <Avatar.Text size={64} label={profile.username.charAt(0).toUpperCase()} style={styles.avatar} />
              <Text style={styles.title}>Welcome, {profile.username}!</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{profile.username}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{profile.email}</Text>
              </View>
              <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} icon="logout">
                Log Out
              </Button>
            </View>
          ) : (
            <Text style={styles.noProfileText}>No profile data available</Text>
          )}
        </View>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Logout</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to logout?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
              <Button onPress={confirmLogout}>OK</Button>
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
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
    elevation: 5,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: "#6200ea",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c387e",
    marginBottom: 16,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  noProfileText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#d32f2f",
  },
});

export default ProfileScreen;
