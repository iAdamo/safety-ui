import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignOut } from "@/hooks/SignOut";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
  Badge,
  BadgeIcon,
  BadgeText,
  Button,
  ButtonIcon,
  Icon,
  Tooltip,
  TooltipContent,
  TooltipText,
  Box,
  Text,
  VStack,
} from "@/components/ui";
import {
  ArrowLeftIcon,
  PlusIcon,
  MapPinIcon,
  SettingsIcon,
} from "lucide-react-native";

const OptionMenu = () => {
  const signOut = useSignOut();
  const router = useRouter();
  return (
    <Box className="absolute bottom-20 right-5">
      <VStack space="md">
        <Tooltip
          placement="left"
          trigger={(triggerProps) => (
            <Button
              className="w-16 h-16 rounded-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700 shadow-hard-5"
              onPress={() => router.push("/auth/signup")}
              {...triggerProps}
            >
              <ButtonIcon as={PlusIcon} />
            </Button>
          )}
        >
          <TooltipContent className="bg-background-50 rounded-md">
            <Box className="p-2.5">
              <Text size="sm">Settings</Text>
            </Box>
          </TooltipContent>
        </Tooltip>

        <Menu
          offset={5}
          placement="bottom left"
          trigger={({ ...triggerProps }) => {
            return (
              <Button
                className="w-16 h-16 rounded-full bg-Khaki data-[hover=true]:bg-Khaki-600 data-[active=true]:bg-Khaki-700"
                {...triggerProps}
              >
                <ButtonIcon as={SettingsIcon} />
              </Button>
            );
          }}
        >
          <MenuItem
            key="Membership"
            textValue="Membership"
            className="p-2 justify-between"
          >
            <MenuItemLabel size="sm">Membership</MenuItemLabel>
            <Badge action="success" className="rounded-full">
              <BadgeText className="text-2xs capitalize">Pro</BadgeText>
            </Badge>
          </MenuItem>
          <MenuItem key="Orders" textValue="Orders" className="p-2">
            <MenuItemLabel size="sm">Orders</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Address Book" textValue="Address Book" className="p-2">
            <MenuItemLabel size="sm">Address Book</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            key="Earn & Redeem"
            textValue="Earn & Redeem"
            className="p-2"
          >
            <MenuItemLabel size="sm">Earn & Redeem</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Coupons" textValue="Coupons" className="p-2">
            <MenuItemLabel size="sm">Coupons</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Help Center" textValue="Help Center" className="p-2">
            <MenuItemLabel size="sm">Help Center</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            key="Logout"
            textValue="Logout"
            className="p-2"
            onPress={() => {
              signOut();
              router.push("/auth/signin");
            }}
          >
            <MenuItemLabel size="sm">Logout</MenuItemLabel>
          </MenuItem>
        </Menu>

        <Tooltip
          placement="left"
          trigger={(triggerProps) => {
            return (
              <Button
                className="w-16 h-16 rounded-full bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
                {...triggerProps}
                onPress={() => router.push("/dashboard/map")}
              >
                <ButtonIcon as={MapPinIcon} />
              </Button>
            );
          }}
        >
          <TooltipContent className="bg-background-50 rounded-md">
            <Box className="p-2.5">
              <Text size="sm">Mark Unsafe Zone</Text>
            </Box>
          </TooltipContent>
        </Tooltip>
      </VStack>
    </Box>
  );
};

export { OptionMenu };
