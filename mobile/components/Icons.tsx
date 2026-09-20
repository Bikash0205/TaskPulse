import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, Image } from "react-native";
import {
  ICON_SUN_ACTIVE,
  ICON_MOON_ACTIVE,
  ICON_BELL_LIGHT,
  ICON_BELL_RING_LIGHT,
} from "../assets/themeIconsBase64";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 22, color = "#002055", strokeWidth = 2 }) => {
  const roofW = Math.round(size * 0.85);
  const bodyW = Math.round(size * 0.62);
  const bodyH = Math.round(size * 0.44);
  const doorW = Math.round(bodyW * 0.38);
  const doorH = Math.round(bodyH * 0.58);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Roof */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: roofW / 2,
          borderRightWidth: roofW / 2,
          borderBottomWidth: Math.round(roofW * 0.44),
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      {/* House Body */}
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Door cutout */}
        <View
          style={{
            width: doorW,
            height: doorH,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const FolderIcon: React.FC<IconProps> = ({ size = 22, color = "#002055", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.86);
  const h = Math.round(size * 0.62);
  const tabW = Math.round(w * 0.46);
  const tabH = Math.max(3, Math.round(h * 0.28));

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: w }}>
        <View
          style={{
            width: tabW,
            height: tabH,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            marginBottom: -strokeWidth,
          }}
        />
        <View
          style={{
            width: w,
            height: h,
            borderRadius: 3,
            borderWidth: strokeWidth,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ size = 22, color = "#FFFFFF", strokeWidth = 2.5 }) => {
  const barLength = Math.round(size * 0.66);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          width: barLength,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: barLength,
          width: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
    </View>
  );
};

export const UserIcon: React.FC<IconProps> = ({ size = 22, color = "#002055", strokeWidth = 2 }) => {
  const headSize = Math.round(size * 0.36);
  const bodyW = Math.round(size * 0.72);
  const bodyH = Math.round(size * 0.36);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          marginBottom: 2,
        }}
      />
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderTopLeftRadius: bodyW / 2,
          borderTopRightRadius: bodyW / 2,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const BellIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Image
      source={{ uri: ICON_BELL_LIGHT }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const GridIcon: React.FC<IconProps> = ({ size = 18, color = "#002055" }) => {
  const cell = Math.round(size * 0.38);
  const gap = Math.max(2, Math.round(size * 0.12));
  const r = Math.max(1.5, Math.round(size * 0.12));

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", marginBottom: gap }}>
        <View style={{ width: cell, height: cell, backgroundColor: color, borderRadius: r, marginRight: gap }} />
        <View style={{ width: cell, height: cell, backgroundColor: color, borderRadius: r }} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: cell, height: cell, backgroundColor: color, borderRadius: r, marginRight: gap }} />
        <View style={{ width: cell, height: cell, backgroundColor: color, borderRadius: r }} />
      </View>
    </View>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = "#848A94", strokeWidth = 2 }) => {
  const circle = Math.round(size * 0.56);
  const handle = Math.round(size * 0.32);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          top: Math.round(size * 0.08),
          left: Math.round(size * 0.08),
          width: circle,
          height: circle,
          borderRadius: circle / 2,
          borderWidth: strokeWidth,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: Math.round(size * 0.14),
          right: Math.round(size * 0.14),
          width: handle,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 18, color = "#002055", strokeWidth = 2 }) => {
  const arrowSize = Math.round(size * 0.38);
  const lineLength = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          width: lineLength,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: Math.round((size - lineLength) / 2),
          width: arrowSize,
          height: arrowSize,
          borderLeftWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = "#FFFFFF", strokeWidth = 2.5 }) => {
  const w = Math.round(size * 0.35);
  const h = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderBottomWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          marginBottom: Math.round(strokeWidth * 1.1),
        }}
      />
    </View>
  );
};

export const CalendarIcon: React.FC<IconProps> = ({ size = 16, color = "#848A94", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.82);
  const h = Math.round(size * 0.82);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: 3,
          borderWidth: strokeWidth,
          borderColor: color,
          overflow: "hidden",
        }}
      >
        <View style={{ width: "100%", height: strokeWidth, backgroundColor: color, marginTop: Math.round(h * 0.25) }} />
      </View>
      <View style={{ position: "absolute", top: 1, left: Math.round(size * 0.25), width: strokeWidth, height: 3, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: "absolute", top: 1, right: Math.round(size * 0.25), width: strokeWidth, height: 3, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

export const ClockIcon: React.FC<IconProps> = ({ size = 14, color = "#848A94", strokeWidth = 2 }) => {
  const handH = Math.round(size * 0.3);
  const handW = Math.round(size * 0.22);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: color,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: Math.round(size * 0.2),
          width: strokeWidth,
          height: handH,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: Math.round(size * 0.44),
          top: Math.round(size * 0.44),
          width: handW,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
    </View>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = "#848A94", strokeWidth = 2 }) => {
  const s = Math.round(size * 0.42);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: s,
          height: s,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          marginRight: 2,
        }}
      />
    </View>
  );
};

export const SendIcon: React.FC<IconProps> = ({ size = 16, color = "#FFFFFF", strokeWidth = 2 }) => {
  const s = Math.round(size * 0.55);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: s / 2,
          borderBottomWidth: s / 2,
          borderLeftWidth: s,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: color,
        }}
      />
    </View>
  );
};

export const XIcon: React.FC<IconProps> = ({ size = 18, color = "#002055", strokeWidth = 2 }) => {
  const len = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          width: len,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: len,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
};

export const NativeProgressDial: React.FC<{ progress: number; size?: number; color?: string }> = ({
  progress,
  size = 46,
  color = "#756EF3",
}) => {
  const strokeWidth = 4;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: "#E9F1FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: progress < 75 ? "transparent" : color,
          borderBottomColor: progress < 50 ? "transparent" : color,
          borderLeftColor: progress < 25 ? "transparent" : color,
          transform: [{ rotate: "-45deg" }],
        }}
      />
      <Text style={{ fontSize: Math.max(9, Math.round(size * 0.26)), fontWeight: "700", color: color || "#002055" }}>
        {Math.round(progress)}%
      </Text>
    </View>
  );
};

export const SunIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Image
      source={{ uri: ICON_SUN_ACTIVE }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const MoonIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Image
      source={{ uri: ICON_MOON_ACTIVE }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const ImageIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.85);
  const h = Math.round(size * 0.7);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: 4,
          borderWidth: strokeWidth,
          borderColor: color,
          overflow: "hidden",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {/* Sun dot inside image */}
        <View
          style={{
            position: "absolute",
            top: 2,
            right: 4,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color,
          }}
        />
        {/* Mountain peak */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: Math.round(w * 0.35),
            borderRightWidth: Math.round(w * 0.35),
            borderBottomWidth: Math.round(h * 0.5),
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const UploadIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.7);
  const stem = Math.round(size * 0.45);
  const arrow = Math.round(size * 0.28);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Arrow Head */}
      <View
        style={{
          position: "absolute",
          top: 3,
          width: arrow,
          height: arrow,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
        }}
      />
      {/* Arrow Stem */}
      <View
        style={{
          position: "absolute",
          top: 4,
          width: strokeWidth,
          height: stem,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
        }}
      />
      {/* Bottom Tray */}
      <View
        style={{
          position: "absolute",
          bottom: 2,
          width: w,
          height: 5,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />
    </View>
  );
};

export const MailIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.85);
  const h = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: 3,
          borderWidth: strokeWidth,
          borderColor: color,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Math.round(w * 0.7),
            height: Math.round(h * 0.45),
            borderBottomWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: "-45deg" }],
            marginTop: -Math.round(h * 0.1),
          }}
        />
      </View>
    </View>
  );
};

export const UsersIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3" }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {/* Left person */}
        <View style={{ alignItems: "center", marginRight: -3, opacity: 0.7 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginBottom: 1 }} />
          <View style={{ width: 10, height: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: color }} />
        </View>
        {/* Main person */}
        <View style={{ alignItems: "center", zIndex: 2 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginBottom: 1 }} />
          <View style={{ width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: color }} />
        </View>
        {/* Right person */}
        <View style={{ alignItems: "center", marginLeft: -3, opacity: 0.7 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginBottom: 1 }} />
          <View style={{ width: 10, height: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: color }} />
        </View>
      </View>
    </View>
  );
};

export const CopyIcon: React.FC<IconProps> = ({ size = 18, color = "#756EF3", strokeWidth = 2 }) => {
  const box = Math.round(size * 0.6);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Background card */}
      <View
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: box,
          height: box,
          borderRadius: 3,
          borderWidth: strokeWidth,
          borderColor: color,
          opacity: 0.5,
        }}
      />
      {/* Foreground card */}
      <View
        style={{
          position: "absolute",
          bottom: 2,
          left: 2,
          width: box,
          height: box,
          borderRadius: 3,
          borderWidth: strokeWidth,
          borderColor: color,
          backgroundColor: "#FFFFFF",
        }}
      />
    </View>
  );
};

export const BuildingIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 2 }) => {
  const w = Math.round(size * 0.75);
  const h = Math.round(size * 0.85);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRadius: 3,
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: 2,
        }}
      >
        <View style={{ flexDirection: "row", gap: 3 }}>
          <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1 }} />
        </View>
        <View style={{ flexDirection: "row", gap: 3 }}>
          <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1 }} />
        </View>
        <View style={{ width: 4, height: 5, backgroundColor: color, borderTopLeftRadius: 1, borderTopRightRadius: 1 }} />
      </View>
    </View>
  );
};

export const BoardIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 1.5 }) => {
  const colW = Math.max(3, Math.round(size * 0.22));
  const gap = Math.max(2, Math.round(size * 0.1));
  const h1 = Math.round(size * 0.75);
  const h2 = Math.round(size * 0.55);
  const h3 = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap }}>
      <View style={{ width: colW, height: h1, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: colW, height: h2, borderRadius: 2, backgroundColor: color, opacity: 0.8 }} />
      <View style={{ width: colW, height: h3, borderRadius: 2, backgroundColor: color, opacity: 0.6 }} />
    </View>
  );
};

export const ListIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 2 }) => {
  const lineH = Math.max(2, strokeWidth);
  const w = Math.round(size * 0.7);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center", gap: 3 }}>
      <View style={{ width: w, height: lineH, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: w, height: lineH, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: w * 0.6, height: lineH, backgroundColor: color, borderRadius: 1, alignSelf: "flex-start", marginLeft: (size - w) / 2 }} />
    </View>
  );
};

export const TimelineIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 2 }) => {
  const barH = Math.max(2.5, Math.round(size * 0.16));
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "flex-start", gap: 3, paddingHorizontal: 2 }}>
      <View style={{ width: Math.round(size * 0.55), height: barH, backgroundColor: color, borderRadius: 2, marginLeft: 1 }} />
      <View style={{ width: Math.round(size * 0.75), height: barH, backgroundColor: color, borderRadius: 2, marginLeft: Math.round(size * 0.2) }} />
      <View style={{ width: Math.round(size * 0.45), height: barH, backgroundColor: color, borderRadius: 2, marginLeft: Math.round(size * 0.4) }} />
    </View>
  );
};

export const DiamondMilestoneIcon: React.FC<IconProps> = ({ size = 16, color = "#F59E0B" }) => {
  const d = Math.round(size * 0.65);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: d,
          height: d,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

export const ChatBubbleIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 1.5 }) => {
  const w = Math.round(size * 0.75);
  const h = Math.round(size * 0.6);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: 4,
          borderWidth: strokeWidth,
          borderColor: color,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: w * 0.5, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const CheckCircleFilledIcon: React.FC<IconProps> = ({ size = 20, color = "#10B981" }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: Math.round(size * 0.32),
          height: Math.round(size * 0.52),
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderColor: "#FFFFFF",
          transform: [{ rotate: "45deg" }],
          marginTop: -2,
        }}
      />
    </View>
  );
};

export const ActivityPulseIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3" }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        <View style={{ width: 4, height: 1.5, backgroundColor: color }} />
        <View style={{ width: 2, height: 8, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: 2, height: 14, backgroundColor: color, borderRadius: 1, marginHorizontal: 1 }} />
        <View style={{ width: 2, height: 6, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: 4, height: 1.5, backgroundColor: color }} />
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const LayersIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 1.8 }) => {
  const w = Math.round(size * 0.72);
  const h = Math.round(size * 0.32);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRadius: 3,
          transform: [{ rotate: "-15deg" }],
          position: "absolute",
          top: 3,
        }}
      />
      <View
        style={{
          width: w,
          height: h,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRadius: 3,
          backgroundColor: "transparent",
          position: "absolute",
          top: 9,
        }}
      />
    </View>
  );
};

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 20, color = "#10B981", strokeWidth = 1.8 }) => {
  const w = Math.round(size * 0.7);
  const h = Math.round(size * 0.82);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: strokeWidth,
          borderColor: color,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: w / 2,
          borderBottomRightRadius: w / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: Math.round(w * 0.28),
            height: Math.round(h * 0.38),
            borderBottomWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: "45deg" }],
            marginTop: -2,
          }}
        />
      </View>
    </View>
  );
};

export const SlidersIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3", strokeWidth = 1.8 }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: size * 0.75, height: 2, backgroundColor: color, borderRadius: 1, marginVertical: 3 }}>
        <View style={{ position: "absolute", left: 3, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      </View>
      <View style={{ width: size * 0.75, height: 2, backgroundColor: color, borderRadius: 1, marginVertical: 3 }}>
        <View style={{ position: "absolute", right: 3, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const InfoIcon: React.FC<IconProps> = ({ size = 20, color = "#64748B", strokeWidth = 1.8 }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color, marginBottom: 2 }} />
      <View style={{ width: 2, height: 6, borderRadius: 1, backgroundColor: color }} />
    </View>
  );
};

export const PulseIcon: React.FC<IconProps> = ({ size = 20, color = "#756EF3" }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 2, height: 4, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: 2, height: 10, backgroundColor: color, borderRadius: 1, marginHorizontal: 1 }} />
        <View style={{ width: 2, height: 16, backgroundColor: color, borderRadius: 1, marginHorizontal: 1 }} />
        <View style={{ width: 2, height: 6, backgroundColor: color, borderRadius: 1, marginHorizontal: 1 }} />
        <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const LockIcon: React.FC<IconProps> = ({ size = 18, color = "#64748B", strokeWidth = 1.8 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.45,
          borderTopLeftRadius: size * 0.28,
          borderTopRightRadius: size * 0.28,
          borderWidth: strokeWidth,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.75,
          height: size * 0.5,
          borderRadius: 3,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: 2, height: 4, backgroundColor: "#FFFFFF", borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const AnimatedAddButton: React.FC<{
  onPress?: () => void;
  size?: number;
  color?: string;
  bg?: string;
}> = ({ onPress, size = 56, color = "#FFFFFF", bg = "#756EF3" }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    if (onPress) onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -22,
        shadowColor: bg,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }, { rotate: spin }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PlusIcon size={Math.round(size * 0.48)} color={color} strokeWidth={2.5} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const AnimatedThemeToggle: React.FC<{
  isDarkMode: boolean;
  onPress?: () => void;
  size?: number;
}> = ({ isDarkMode, onPress, size = 18 }) => {
  const spinAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(spinAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 380,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.25,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isDarkMode]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const content = (
    <Animated.View
      style={{
        transform: [{ rotate: spin }, { scale: scaleAnim }],
        justifyContent: "center",
        alignItems: "center",
        width: size + 6,
        height: size + 6,
      }}
    >
      {isDarkMode ? (
        <SunIcon size={size} color="#F59E0B" />
      ) : (
        <MoonIcon size={size} color="#4338CA" />
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const BarChartIcon: React.FC<IconProps> = ({ size = 20, color = "#002055" }) => {
  const barW = Math.max(3, Math.round(size * 0.18));
  return (
    <View style={{ width: size, height: size, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 2 }}>
      <View style={{ width: barW, height: "45%", backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: barW, height: "80%", backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: barW, height: "60%", backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: barW, height: "100%", backgroundColor: color, borderRadius: 1.5 }} />
    </View>
  );
};

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 20, color = "#10B981" }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: size * 0.8, height: size * 0.8, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: color, position: "relative" }}>
        <View style={{ position: "absolute", right: 0, top: 0, width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 7, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: color, transform: [{ rotate: "45deg" }] }} />
        <View style={{ position: "absolute", left: 2, bottom: 2, width: size * 0.6, height: 2, backgroundColor: color, transform: [{ rotate: "-35deg" }, { translateX: 3 }] }} />
      </View>
    </View>
  );
};

export const FileTextIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 1.8 }) => {
  const w = Math.round(size * 0.72);
  const h = Math.round(size * 0.9);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: w, height: h, borderWidth: strokeWidth, borderColor: color, borderRadius: 3, padding: 3, justifyContent: "space-evenly" }}>
        <View style={{ height: 1.5, width: "80%", backgroundColor: color, borderRadius: 1 }} />
        <View style={{ height: 1.5, width: "100%", backgroundColor: color, borderRadius: 1 }} />
        <View style={{ height: 1.5, width: "60%", backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const DownloadIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 2 }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Down arrow stem */}
      <View style={{ width: strokeWidth, height: size * 0.45, backgroundColor: color }} />
      {/* Down arrow head */}
      <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: color, marginTop: -1 }} />
      {/* Tray */}
      <View style={{ width: size * 0.75, height: strokeWidth, backgroundColor: color, marginTop: 4, borderRadius: 1 }} />
    </View>
  );
};



