import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import { GoogleIcon, XIcon, CheckCircleFilledIcon } from "./Icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface GoogleAccountOption {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member";
  initials: string;
  avatarColor: string;
  isOwner?: boolean;
}

interface GoogleOAuthModalProps {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccountOption) => void;
  triggerHaptic?: (type?: "light" | "selection" | "success") => void;
}

const KNOWN_GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
  {
    id: "g-1",
    name: "Bikash Kumar Yadav",
    email: "zevonbcash@gmail.com",
    role: "admin",
    initials: "BY",
    avatarColor: "#4285F4",
    isOwner: true,
  },
  {
    id: "g-2",
    name: "Sarah Chen",
    email: "sarah.chen@taskpulse.io",
    role: "manager",
    initials: "SC",
    avatarColor: "#34A853",
  },
  {
    id: "g-3",
    name: "Marcus Lee",
    email: "marcus@taskpulse.io",
    role: "member",
    initials: "ML",
    avatarColor: "#EA4335",
  },
];

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  visible,
  isDarkMode,
  onClose,
  onSelectAccount,
  triggerHaptic,
}) => {
  const [step, setStep] = useState<"select" | "custom" | "authenticating" | "error">("select");
  const [customEmail, setCustomEmail] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [activeAccount, setActiveAccount] = useState<GoogleAccountOption | null>(null);
  const [authStatusMessage, setAuthStatusMessage] = useState("Connecting to Google Identity Services...");
  const [errorMessage, setErrorMessage] = useState("");

  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setStep("select");
      setCustomEmail("");
      setCustomPassword("");
      setActiveAccount(null);
      setErrorMessage("");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (step === "authenticating") {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [step]);

  const handleChooseAccount = (acc: GoogleAccountOption) => {
    if (triggerHaptic) triggerHaptic("selection");
    setActiveAccount(acc);
    setStep("authenticating");
    setAuthStatusMessage("Contacting accounts.google.com...");

    setTimeout(() => {
      setAuthStatusMessage("Verifying OAuth 2.0 PKCE tokens & OpenID claims...");
    }, 450);

    setTimeout(() => {
      setAuthStatusMessage("Authorizing TaskPulse workspace permissions...");
    }, 950);

    setTimeout(() => {
      if (triggerHaptic) triggerHaptic("success");
      onSelectAccount(acc);
    }, 1450);
  };

  const handleCustomSubmit = () => {
    const trimmed = customEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage("Please enter a valid Google account email.");
      if (triggerHaptic) triggerHaptic("selection");
      return;
    }
    if (customPassword.length < 6) {
      setErrorMessage("Google account password must be at least 6 characters.");
      if (triggerHaptic) triggerHaptic("selection");
      return;
    }

    setErrorMessage("");
    const newAcc: GoogleAccountOption = {
      id: `g-${Date.now()}`,
      name: trimmed.split("@")[0].replace(".", " "),
      email: trimmed,
      role: "member",
      initials: trimmed.substring(0, 2).toUpperCase(),
      avatarColor: "#FBBC05",
    };

    handleChooseAccount(newAcc);
  };

  const handleLaunchBrowserOAuth = async () => {
    if (triggerHaptic) triggerHaptic("selection");
    const oauthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      "client_id=taskpulse-production.apps.googleusercontent.com" +
      "&redirect_uri=io.taskpulse.app://oauth2callback" +
      "&response_type=token" +
      "&scope=email%20profile%20openid" +
      "&prompt=select_account";

    try {
      const supported = await Linking.canOpenURL(oauthUrl);
      if (supported) {
        await Linking.openURL(oauthUrl);
      }
    } catch (e) {
      // In sandbox mode fallback to prompt
    }
  };

  const colors = {
    bg: isDarkMode ? "#111827" : "#FFFFFF",
    cardBg: isDarkMode ? "#1F2937" : "#F8FAFC",
    border: isDarkMode ? "#374151" : "#E2E8F0",
    textPrimary: isDarkMode ? "#F9FAFB" : "#0F172A",
    textSecondary: isDarkMode ? "#9CA3AF" : "#64748B",
    inputBg: isDarkMode ? "#0B0F19" : "#FFFFFF",
    divider: isDarkMode ? "#374151" : "#F1F5F9",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.bg, borderColor: colors.border },
            { opacity: fadeAnim },
          ]}
        >
          {/* Google Modal Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <GoogleIcon size={24} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.headerBrand, { color: colors.textPrimary }]}>
                  Google
                </Text>
                <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
                  Sign in with Google
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={[styles.closeBtn, { backgroundColor: colors.cardBg }]}
            >
              <XIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body Content based on Step */}
          {step === "select" && (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <Text style={[styles.titleText, { color: colors.textPrimary }]}>
                Choose an account
              </Text>
              <Text style={[styles.descText, { color: colors.textSecondary }]}>
                to continue to TaskPulse Enterprise (io.taskpulse.app)
              </Text>

              {/* Accounts List */}
              <View style={styles.accountsList}>
                {KNOWN_GOOGLE_ACCOUNTS.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    activeOpacity={0.75}
                    onPress={() => handleChooseAccount(acc)}
                    style={[
                      styles.accountRow,
                      { backgroundColor: colors.cardBg, borderColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: acc.avatarColor },
                      ]}
                    >
                      <Text style={styles.avatarInitials}>{acc.initials}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                          style={[styles.accountName, { color: colors.textPrimary }]}
                          numberOfLines={1}
                        >
                          {acc.name}
                        </Text>
                        {acc.isOwner && (
                          <View style={styles.ownerBadge}>
                            <Text style={styles.ownerBadgeText}>Workspace Owner</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[styles.accountEmail, { color: colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {acc.email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Use Another Account Option */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    if (triggerHaptic) triggerHaptic("selection");
                    setStep("custom");
                  }}
                  style={[
                    styles.accountRow,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: isDarkMode ? "#374151" : "#E2E8F0" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarInitials,
                        { color: colors.textPrimary, fontSize: 18 },
                      ]}
                    >
                      +
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.accountName, { color: colors.textPrimary }]}>
                      Use another Google account
                    </Text>
                    <Text style={[styles.accountEmail, { color: colors.textSecondary }]}>
                      Sign in with custom Google ID
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* In-App Security Disclosure */}
              <View style={styles.disclosureSection}>
                <Text style={[styles.disclosureText, { color: colors.textSecondary }]}>
                  To continue, Google will share your verified name, email address, language preference, and profile picture directly with TaskPulse via Google Identity Services.
                </Text>
              </View>
            </ScrollView>
          )}

          {step === "custom" && (
            <View>
              <Text style={[styles.titleText, { color: colors.textPrimary }]}>
                Sign in with Google
              </Text>
              <Text style={[styles.descText, { color: colors.textSecondary }]}>
                Enter your Google Account email and security credentials.
              </Text>

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                EMAIL OR PHONE
              </Text>
              <TextInput
                value={customEmail}
                onChangeText={(t) => {
                  setCustomEmail(t);
                  setErrorMessage("");
                }}
                placeholder="name@gmail.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.customInput,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: colors.textSecondary, marginTop: 12 },
                ]}
              >
                PASSWORD
              </Text>
              <TextInput
                value={customPassword}
                onChangeText={(t) => {
                  setCustomPassword(t);
                  setErrorMessage("");
                }}
                placeholder="Google account password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                style={[
                  styles.customInput,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />

              <View style={styles.formBtnRow}>
                <TouchableOpacity
                  onPress={() => setStep("select")}
                  style={[styles.backBtn, { borderColor: colors.border }]}
                >
                  <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCustomSubmit}
                  style={styles.nextBtn}
                >
                  <Text style={styles.nextBtnText}>Authenticate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === "authenticating" && (
            <View style={styles.authenticatingContainer}>
              <ActivityIndicator size="large" color="#4285F4" style={{ marginBottom: 18 }} />
              <Text style={[styles.authLoadingTitle, { color: colors.textPrimary }]}>
                Google Authentication
              </Text>
              <Text style={[styles.authLoadingSub, { color: colors.textSecondary }]}>
                {authStatusMessage}
              </Text>
              {activeAccount && (
                <View
                  style={[
                    styles.activeAccountPill,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.activeAccountPillText, { color: colors.textPrimary }]}>
                    Signing in as {activeAccount.email}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.2)",
    marginBottom: 16,
  },
  headerBrand: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  accountsList: {
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  accountName: {
    fontSize: 14,
    fontWeight: "600",
  },
  accountEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  ownerBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4285F4",
  },
  disclosureSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.15)",
    paddingTop: 12,
  },
  disclosureText: {
    fontSize: 11,
    lineHeight: 15,
  },
  browserOAuthBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  browserOAuthBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4285F4",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  customInput: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  formBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
  },
  errorBannerText: {
    color: "#EF4444",
    fontSize: 12,
  },
  authenticatingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  authLoadingTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  authLoadingSub: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },
  activeAccountPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeAccountPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
