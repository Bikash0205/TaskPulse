import React from "react";
import { View, Text } from "react-native";

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

export const BellIcon: React.FC<IconProps> = ({ size = 20, color = "#002055", strokeWidth = 2 }) => {
  const bellW = Math.round(size * 0.68);
  const bellH = Math.round(size * 0.54);
  const clapperW = Math.max(3, Math.round(size * 0.22));
  const clapperH = Math.max(2, Math.round(size * 0.16));

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: 3,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 1,
        }}
      />
      <View
        style={{
          width: bellW,
          height: bellH,
          borderTopLeftRadius: bellW / 2,
          borderTopRightRadius: bellW / 2,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          borderWidth: strokeWidth,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: bellW + 4,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          marginTop: -strokeWidth / 2,
        }}
      />
      <View
        style={{
          width: clapperW,
          height: clapperH,
          borderBottomLeftRadius: clapperW / 2,
          borderBottomRightRadius: clapperW / 2,
          backgroundColor: color,
          marginTop: 1,
        }}
      />
    </View>
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

export const SunIcon: React.FC<IconProps> = ({ size = 20, color = "#F59E0B" }) => {
  const core = Math.round(size * 0.44);
  const rayLen = Math.round(size * 0.18);
  const rayThick = 2;
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: core,
          height: core,
          borderRadius: core / 2,
          backgroundColor: color,
        }}
      />
      {/* 4 cardinal rays */}
      <View style={{ position: "absolute", top: 1, width: rayThick, height: rayLen, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: "absolute", bottom: 1, width: rayThick, height: rayLen, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: "absolute", left: 1, height: rayThick, width: rayLen, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: "absolute", right: 1, height: rayThick, width: rayLen, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

export const MoonIcon: React.FC<IconProps> = ({ size = 20, color = "#818CF8" }) => {
  const d = Math.round(size * 0.75);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          borderWidth: 2.5,
          borderColor: color,
          borderRightColor: "transparent",
          borderTopColor: "transparent",
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
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

