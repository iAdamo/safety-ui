import React, { useState } from "react";
import { Modal, Text, Button, View } from "react-native";
import * as Location from "expo-location";
import { AlertModal } from "@/components/modals/Alert/AlertModal";


export function LocationPermissionsWithPolicy() {
  const [foregroundStatus, requestForegroundPermissions] =
    Location.useForegroundPermissions();
  const [backgroundStatus, requestBackgroundPermissions] =
    Location.useBackgroundPermissions();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestPermissions = async () => {
    try {
      // Request foreground permissions first
      if (foregroundStatus?.status !== "granted") {
        const { status: fgStatus } = await requestForegroundPermissions();
        if (fgStatus !== "granted") {
          setError("Foreground location permission not granted.");
          return;
        }
      }

      // Show policy modal if background permission is not granted
      if (backgroundStatus?.status !== "granted") {
        setShowPolicyModal(true);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const handleAcceptPolicy = async () => {
    setShowPolicyModal(false);
    try {
      const { status: bgStatus } = await requestBackgroundPermissions();
      if (bgStatus !== "granted") {
        setError("Background location permission not granted.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <View>
      <Button title="Enable Location" onPress={handleRequestPermissions} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <Modal visible={showPolicyModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text>
              We need your background location to provide features like
              notifications when you are near unsafe zones. This data is used
              responsibly and helps enhance your safety.
            </Text>
            <Button title="I Understand" onPress={handleAcceptPolicy} />
            <Button title="Cancel" onPress={() => setShowPolicyModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

