import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckIcon,
} from "@/components/ui";
import { useStorageState } from "@/utils/UseStorageState";

export function LocationPermissionsWithPolicy() {
  const [foregroundStatus, requestForegroundPermissions] =
    Location.useForegroundPermissions();
  const [backgroundStatus, requestBackgroundPermissions] =
    Location.useBackgroundPermissions();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [[loading, doNotAskAgain], setDoNotAskAgainStorage] = useStorageState<
    boolean | undefined
  >("doNotAskAgain");

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (loading) return;
        // Check if background permission is already granted
        if (backgroundStatus?.status !== "granted" && !doNotAskAgain) {
          setShowPolicyModal(true);
        }
      } catch (err) {
        setError(String(err));
      }
    };

    checkPermissions();
  }, [backgroundStatus, doNotAskAgain, loading]);

  const handleAcceptPolicy = async () => {
    setShowPolicyModal(false);

    try {
      // Request foreground permissions first
      const { status: fgStatus } = await requestForegroundPermissions();
      if (fgStatus !== "granted") {
        setError("Foreground location permission is required.");
        return;
      }

      // Request background permissions
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

  const handleRejectPolicy = () => {
    setShowPolicyModal(false);
    setError("Background location permission was rejected.");
  };

  const toggleDoNotAskAgain = () => {
    setDoNotAskAgainStorage(!doNotAskAgain);
  };

  return (
    <VStack>
      <Modal
        isOpen={showPolicyModal}
        isKeyboardDismissable={false}
        closeOnOverlayClick={false}
        avoidKeyboard={true}
      >
        <ModalBackdrop />
        <ModalContent className="md:h-[90%] my-52">
          <ModalHeader className="flex-col">
            <Heading size="xl" className="text-center">
              SAFETY PRO
            </Heading>
            <Heading size="xl" className="text-center">
              Background Location Policy
            </Heading>
          </ModalHeader>
          <ModalBody>
            <VStack className="gap-1">
              <Text>
                We need your permission to access your location in the
                background. This allows us to provide you with real-time
                notifications and alerts when you are near unsafe zones, even
                when the app is not actively in use. Your safety is our
                priority, and we use this information responsibly to ensure you
                are always aware of potential hazards in your vicinity. Please
                grant background location access to enable these important
                features.
              </Text>
              <Heading size="md">Scope</Heading>
              <Text className="inline-block">
                This policy applies to all users of the
                <Text className="font-bold"> Safety Pro </Text>
                mobile application who enable background location services.
              </Text>
              <Heading size="md"> Policy Details</Heading>
              <Text>
                <Heading size="sm">1. Data Collection</Heading> We collect
                GPS-based location data when the app is running in the
                background. Data is collected only with your explicit
                permission.
              </Text>
              <Text>
                <Heading size="sm">2. Data Usage</Heading> The data collected is
                used to: Notify you of nearby hazards or safety alerts. Enable
                personalized features, such as geolocation-based reminders.
              </Text>
              <Text>
                <Heading size="sm">3. Data Sharing</Heading> Your location data
                is not shared with third parties without your consent.
                Aggregated, anonymized data may be used for research or app
                improvement purposes. ![Insert Shield or Privacy Icon Here]
              </Text>
              <Text>
                <Heading size="sm">4. Data Storage and Security</Heading> Your
                data is stored securely on encrypted servers. Access is
                restricted to authorized personnel only.
              </Text>
              <Heading size="md">User Rights</Heading>
              <Text>
                You have the following rights regarding your location data:
              </Text>
              <Text className="ml-4 font-bold">
                Opt-Out: You can disable background location tracking anytime
                via your app settings.
              </Text>
              <Text className="ml-4 font-bold">
                Data Deletion: Request the deletion of your collected data by
                contacting our support team. Consent
              </Text>
              <Heading size="md">Frequently Asked Questions (FAQ)</Heading>
              <Heading size="sm">
                Q: Can I use the app without sharing my location?
              </Heading>
              <Text>A: Yes, but certain features may be limited.</Text>
              <Heading size="sm">
                Q: How do I change my location preferences?
              </Heading>
              <Text>
                A: Go to [Settings {">"} Location Permissions] in the app to
                modify your preferences.
              </Text>
              <Heading size="md">Policy Version</Heading>
              <Text>
                Policy Version Version 1.0 | Last Updated: 25th January, 2025
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter className="flex-col items-start">
            <Heading size="sm">
              By enabling location services, you agree to the terms outlined in
              this policy. You can review or update your preferences in the app
              settings.
            </Heading>
            <Checkbox
              value="doNotAskAgain"
              isChecked={doNotAskAgain ?? false}
              onChange={toggleDoNotAskAgain}
              className="mt-4"
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel> Do not ask me again</CheckboxLabel>
            </Checkbox>
            <HStack className="mt-4 justify-between w-full">
              <Button
                className="w-[45%] bg-teal-500 hover:bg-teal-600 active:bg-teal-700"
                onPress={handleAcceptPolicy}
                size="md"
              >
                <ButtonText>I Understand</ButtonText>
              </Button>
              <Button
                className="w-[45%] bg-red-500 hover:bg-red-600 active:bg-red-700"
                size="md"
                onPress={handleRejectPolicy}
              >
                <ButtonText>Reject</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
