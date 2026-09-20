import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  ChatBubbleIcon,
  SendIcon,
  ShieldCheckIcon,
  CheckIcon,
  XIcon,
} from "./Icons";
import { AnimatedToggleSwitch } from "./AnimatedToggleSwitch";

export interface ThreadedComment {
  id: string;
  author: string;
  role: "Super Admin" | "Tech Lead" | "Compliance Officer" | "Specialist" | "Client Stakeholder";
  text: string;
  time: string;
  isInternalOnly?: boolean;
  replies?: {
    id: string;
    author: string;
    role: "Super Admin" | "Tech Lead" | "Compliance Officer" | "Specialist" | "Client Stakeholder";
    text: string;
    time: string;
    isInternalOnly?: boolean;
  }[];
}

interface EnterpriseThreadedDiscussionProps {
  taskId: string;
  taskTitle: string;
  isDarkMode: boolean;
  currentUserRole?: string;
  currentUserName?: string;
  triggerHaptic?: (style?: "light" | "selection" | "success") => void;
}

export const EnterpriseThreadedDiscussionSection: React.FC<EnterpriseThreadedDiscussionProps> = ({
  taskId,
  taskTitle,
  isDarkMode,
  currentUserRole = "Super Admin",
  currentUserName = "Bikash Kumar Yadav",
  triggerHaptic,
}) => {
  // Mode: Full Internal View vs Client/Guest Safe Portal View
  const [isClientPortalMode, setIsClientPortalMode] = useState(false);

  // Replying state
  const [replyTargetCommentId, setReplyTargetCommentId] = useState<string | null>(null);
  const [replyTargetAuthor, setReplyTargetAuthor] = useState<string | null>(null);

  // New comment input
  const [inputText, setInputText] = useState("");
  const [isNoteInternalOnly, setIsNoteInternalOnly] = useState(false);

  // Thread comments state with pre-populated enterprise discussions
  const [threads, setThreads] = useState<ThreadedComment[]>([
    {
      id: "thread-1",
      author: "Bikash Kumar Yadav",
      role: "Super Admin",
      time: "25m ago",
      text: "Formal Governance Gate 1 (Design QA Audit) successfully signed with cryptographic token AUTH-SIG#AA30.",
      isInternalOnly: false,
      replies: [
        {
          id: "rep-1-1",
          author: "Elena Rostova",
          role: "Tech Lead",
          time: "18m ago",
          text: "Verified responsive touch boundaries and zero layout shifts on physical device. Test pass rate is 100%.",
          isInternalOnly: true,
        },
        {
          id: "rep-1-2",
          author: "Marcus Vance",
          role: "Specialist",
          time: "12m ago",
          text: "Customer sign-off milestone is staged. Preparing executive briefing for quarterly steering committee.",
          isInternalOnly: false,
        },
      ],
    },
    {
      id: "thread-2",
      author: "David Kim (Acme Partner)",
      role: "Client Stakeholder",
      time: "8m ago",
      text: "Reviewed the latest release milestone. The responsive navigation and offline telemetry sync meet enterprise requirements.",
      isInternalOnly: false,
      replies: [
        {
          id: "rep-2-1",
          author: "Bikash Kumar Yadav",
          role: "Super Admin",
          time: "4m ago",
          text: "Thank you David. The signed board brief and SOC 2 audit ledger have been compiled and attached.",
          isInternalOnly: false,
        },
      ],
    },
  ]);

  // Styling tokens
  const bgCard = isDarkMode ? "#162032" : "#F8FAFC";
  const bgReply = isDarkMode ? "#1D2B44" : "#EEF2F6";
  const borderCol = isDarkMode ? "#253554" : "#E2E8F0";
  const textPrimary = isDarkMode ? "#F1F5F9" : "#0F172A";
  const textMuted = isDarkMode ? "#94A3B8" : "#64748B";
  const primaryBrand = "#6366F1";
  const accentSuccess = "#10B981";
  const accentAmber = "#F59E0B";

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Super Admin":
        return { bg: "rgba(99, 102, 241, 0.15)", text: "#6366F1" };
      case "Tech Lead":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" };
      case "Compliance Officer":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" };
      case "Client Stakeholder":
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#D97706" };
      default:
        return { bg: "rgba(100, 116, 139, 0.15)", text: "#64748B" };
    }
  };

  const handlePost = () => {
    if (!inputText.trim()) return;
    if (triggerHaptic) triggerHaptic("success");

    const newEntry = {
      id: "entry-" + Date.now(),
      author: currentUserName,
      role: "Super Admin" as const,
      text: inputText.trim(),
      time: "Just now",
      isInternalOnly: isNoteInternalOnly,
    };

    if (replyTargetCommentId) {
      // Add as nested reply
      setThreads((prev) =>
        prev.map((th) => {
          if (th.id === replyTargetCommentId) {
            return {
              ...th,
              replies: [...(th.replies || []), newEntry],
            };
          }
          return th;
        })
      );
      setReplyTargetCommentId(null);
      setReplyTargetAuthor(null);
    } else {
      // Add as new top-level thread
      setThreads((prev) => [
        ...prev,
        {
          ...newEntry,
          replies: [],
        },
      ]);
    }

    setInputText("");
    setIsNoteInternalOnly(false);
  };

  const visibleThreads = threads.map((th) => {
    if (!isClientPortalMode) return th;
    // In Client Portal Mode, filter out internal-only replies and sanitize internal top-level
    return {
      ...th,
      replies: (th.replies || []).filter((r) => !r.isInternalOnly),
    };
  });

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
            <ChatBubbleIcon size={15} color={primaryBrand} />
          </View>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Threaded Discussions & Portal
          </Text>
        </View>

        <View style={[styles.countBadge, { backgroundColor: isDarkMode ? "#1E293B" : "#E2E8F0" }]}>
          <Text style={[styles.countBadgeText, { color: textMuted }]}>
            {threads.reduce((acc, t) => acc + 1 + (t.replies?.length || 0), 0)} Notes
          </Text>
        </View>
      </View>

      {/* Client / Guest Portal Safe Mode Toggle Strip */}
      <View style={[styles.portalToggleStrip, { backgroundColor: bgCard, borderColor: borderCol }]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ShieldCheckIcon
              size={15}
              color={isClientPortalMode ? accentAmber : accentSuccess}
            />
            <Text style={[styles.portalToggleLabel, { color: textPrimary }]}>
              {isClientPortalMode ? "Client / Guest Portal View" : "Internal Enterprise View"}
            </Text>
          </View>
          <Text style={[styles.portalToggleSub, { color: textMuted }]}>
            {isClientPortalMode
              ? "Sanitized: Internal notes and engineering logs are hidden."
              : "Unrestricted: All engineering and executive notes visible."}
          </Text>
        </View>

        <AnimatedToggleSwitch
          value={isClientPortalMode}
          onValueChange={(val) => {
            if (triggerHaptic) triggerHaptic("selection");
            setIsClientPortalMode(val);
          }}
          isDarkMode={isDarkMode}
          activeColor={accentAmber}
        />
      </View>

      {/* Client Portal Mode Warning Banner if active */}
      {isClientPortalMode && (
        <View style={[styles.portalAlertBanner, { backgroundColor: "rgba(245, 158, 11, 0.12)", borderColor: accentAmber }]}>
          <Text style={[styles.portalAlertText, { color: accentAmber }]}>
            Client Portal Safe Mode Active: External stakeholders only receive sanitized progress notes.
          </Text>
        </View>
      )}

      {/* Thread Stream */}
      <View style={{ gap: 12, marginTop: 8 }}>
        {visibleThreads.map((thread) => {
          const authorBadge = getRoleBadgeStyle(thread.role);

          return (
            <View
              key={thread.id}
              style={[
                styles.threadCard,
                {
                  backgroundColor: bgCard,
                  borderColor: thread.isInternalOnly ? "#F59E0B" : borderCol,
                },
              ]}
            >
              {/* Thread Header */}
              <View style={styles.threadHeaderRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <Text style={[styles.authorName, { color: textPrimary }]}>
                    {thread.author}
                  </Text>
                  <View style={[styles.roleBadge, { backgroundColor: authorBadge.bg }]}>
                    <Text style={[styles.roleBadgeText, { color: authorBadge.text }]}>
                      {thread.role}
                    </Text>
                  </View>
                  {thread.isInternalOnly && (
                    <View style={[styles.internalBadge, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                      <Text style={[styles.internalBadgeText, { color: accentAmber }]}>Internal Only</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.timeText, { color: textMuted }]}>{thread.time}</Text>
              </View>

              {/* Thread Body */}
              <Text style={[styles.bodyText, { color: textPrimary }]}>{thread.text}</Text>

              {/* Thread Action Row */}
              <View style={styles.threadActionRow}>
                <TouchableOpacity
                  onPress={() => {
                    if (triggerHaptic) triggerHaptic("light");
                    setReplyTargetCommentId(thread.id);
                    setReplyTargetAuthor(thread.author);
                  }}
                  style={styles.replyButton}
                >
                  <Text style={[styles.replyButtonText, { color: primaryBrand }]}>
                    Reply to thread
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Nested Replies Stream */}
              {thread.replies && thread.replies.length > 0 && (
                <View style={styles.repliesContainer}>
                  {thread.replies.map((reply) => {
                    const replyRoleBadge = getRoleBadgeStyle(reply.role);

                    return (
                      <View
                        key={reply.id}
                        style={[
                          styles.replyItem,
                          {
                            backgroundColor: bgReply,
                            borderColor: reply.isInternalOnly ? accentAmber : borderCol,
                          },
                        ]}
                      >
                        <View style={styles.replyHeaderRow}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text style={[styles.replyAuthorName, { color: textPrimary }]}>
                              {reply.author}
                            </Text>
                            <View style={[styles.roleBadge, { backgroundColor: replyRoleBadge.bg }]}>
                              <Text style={[styles.roleBadgeText, { color: replyRoleBadge.text }]}>
                                {reply.role}
                              </Text>
                            </View>
                            {reply.isInternalOnly && (
                              <View style={[styles.internalBadge, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                                <Text style={[styles.internalBadgeText, { color: accentAmber }]}>Internal</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.timeText, { color: textMuted }]}>{reply.time}</Text>
                        </View>
                        <Text style={[styles.replyBodyText, { color: textPrimary }]}>{reply.text}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Composer Section */}
      <View style={[styles.composerCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
        {/* If replying to specific comment */}
        {replyTargetAuthor && (
          <View style={[styles.replyingBanner, { backgroundColor: isDarkMode ? "#1E293B" : "#EEF2F6" }]}>
            <Text style={[styles.replyingText, { color: primaryBrand }]}>
              Replying to {replyTargetAuthor}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (triggerHaptic) triggerHaptic("light");
                setReplyTargetCommentId(null);
                setReplyTargetAuthor(null);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <XIcon size={14} color={textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Text Box */}
        <TextInput
          placeholder={
            replyTargetAuthor
              ? `Write reply to ${replyTargetAuthor}...`
              : "Add discussion note, milestone feedback, or review comments..."
          }
          placeholderTextColor={textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={2}
          style={[styles.composerTextInput, { color: textPrimary, borderColor: borderCol }]}
        />

        {/* Composer Controls */}
        <View style={styles.composerControlRow}>
          {/* Internal Only Toggle Pill */}
          <TouchableOpacity
            onPress={() => {
              if (triggerHaptic) triggerHaptic("selection");
              setIsNoteInternalOnly(!isNoteInternalOnly);
            }}
            style={[
              styles.internalPillBtn,
              {
                backgroundColor: isNoteInternalOnly ? "rgba(245, 158, 11, 0.2)" : "transparent",
                borderColor: isNoteInternalOnly ? accentAmber : borderCol,
              },
            ]}
          >
            <Text
              style={[
                styles.internalPillText,
                { color: isNoteInternalOnly ? accentAmber : textMuted },
              ]}
            >
              {isNoteInternalOnly ? "Internal Only (Masked from Clients)" : "Public / Client Visible"}
            </Text>
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity
            onPress={handlePost}
            style={[styles.postButton, { backgroundColor: primaryBrand }]}
          >
            <SendIcon size={13} color="#FFFFFF" />
            <Text style={styles.postButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  portalToggleStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  portalToggleLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  portalToggleSub: {
    fontSize: 10,
    marginTop: 2,
  },
  portalAlertBanner: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  portalAlertText: {
    fontSize: 11,
    fontWeight: "600",
  },
  threadCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  threadHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "700",
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  internalBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  internalBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  timeText: {
    fontSize: 10,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 17,
  },
  threadActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  replyButton: {
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  replyButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },
  repliesContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(99, 102, 241, 0.3)",
    gap: 8,
  },
  replyItem: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  replyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  replyAuthorName: {
    fontSize: 12,
    fontWeight: "700",
  },
  replyBodyText: {
    fontSize: 11,
    lineHeight: 15,
  },
  composerCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    gap: 8,
  },
  replyingBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  composerTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    minHeight: 50,
    textAlignVertical: "top",
  },
  composerControlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  internalPillBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  internalPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  postButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
