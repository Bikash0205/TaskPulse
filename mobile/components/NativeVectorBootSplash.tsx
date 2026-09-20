import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Vibration,
  Platform,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface NativeVectorBootSplashProps {
  isDarkMode?: boolean;
  onBootComplete: () => void;
  durationMs?: number;
}

// 8 Exact geometric vertices from SVG (scaled for mobile stage)
// Reference SVG: M 60,195 L 205,195 L 275,285 L 385,75 L 475,250 L 560,150 L 640,205 L 725,65
const STAGE_WIDTH = 290;
const STAGE_HEIGHT = 100;
const STROKE_WIDTH = 12;

const POINTS = [
  { x: 0.0, y: 56.0 },   // P0: Baseline start
  { x: 63.0, y: 56.0 },  // P1: Baseline end
  { x: 93.0, y: 95.0 },  // P2: Downward dip
  { x: 141.0, y: 4.0 },  // P3: Surge peak
  { x: 180.0, y: 80.0 }, // P4: Valley
  { x: 217.0, y: 37.0 }, // P5: Secondary crest
  { x: 252.0, y: 61.0 }, // P6: Recovery dip
  { x: 290.0, y: 0.0 },  // P7: Arrow Summit
];

// 7 Segments between the points
const SEGMENTS = [
  { from: POINTS[0], to: POINTS[1], color: "#2242D8" }, // Seg 0: Flat Royal Blue
  { from: POINTS[1], to: POINTS[2], color: "#2563EB" }, // Seg 1: Dip Sapphire
  { from: POINTS[2], to: POINTS[3], color: "#0284C7" }, // Seg 2: Surge Cyan
  { from: POINTS[3], to: POINTS[4], color: "#0D9488" }, // Seg 3: Valley Teal
  { from: POINTS[4], to: POINTS[5], color: "#059669" }, // Seg 4: Crest Emerald
  { from: POINTS[5], to: POINTS[6], color: "#10B981" }, // Seg 5: Dip Green
  { from: POINTS[6], to: POINTS[7], color: "#34D399" }, // Seg 6: Summit Neon Emerald
];

export const NativeVectorBootSplash: React.FC<NativeVectorBootSplashProps> = ({
  isDarkMode = false,
  onBootComplete,
  durationMs = 2400,
}) => {
  // Overall exit animations
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const translateYExit = useRef(new Animated.Value(0)).current;

  // Camera tracking (zoom in -> pull back)
  const cameraScale = useRef(new Animated.Value(2.2)).current;
  const cameraTranslateX = useRef(new Animated.Value(60)).current;
  const cameraTranslateY = useRef(new Animated.Value(20)).current;

  // Segment drawing progress values (0 -> 1)
  const segProgress = useRef(SEGMENTS.map(() => new Animated.Value(0))).current;

  // Joint dot opacities (0 -> 1)
  const jointOpacities = useRef(POINTS.map(() => new Animated.Value(0))).current;

  // Arrowhead & Target Ring
  const arrowScale = useRef(new Animated.Value(0)).current;
  const targetRingScale = useRef(new Animated.Value(0)).current;

  // Typography reveal
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    // Joint 0 dot appears immediately
    jointOpacities[0].setValue(1);

    // Build sequential drawing animation for the 7 segments
    const segmentDrawTimings = [
      170, // Seg 0
      140, // Seg 1
      210, // Seg 2 (surge peak)
      160, // Seg 3
      140, // Seg 4
      120, // Seg 5
      190, // Seg 6 (ascent to summit)
    ];

    const drawAnimations = SEGMENTS.map((_, i) => {
      return Animated.parallel([
        Animated.timing(segProgress[i], {
          toValue: 1,
          duration: segmentDrawTimings[i],
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(jointOpacities[i + 1], {
          toValue: 1,
          duration: 40,
          delay: segmentDrawTimings[i] - 30,
          useNativeDriver: true,
        }),
      ]);
    });

    // Run the complete choreographed sequence
    Animated.sequence([
      // Step 1: Draw the segmented pulse line in sync with camera tracking
      Animated.parallel([
        Animated.sequence(drawAnimations),
        // Smooth camera pull-back
        Animated.timing(cameraScale, {
          toValue: 1.0,
          duration: 1150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cameraTranslateX, {
          toValue: 0,
          duration: 1150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cameraTranslateY, {
          toValue: 0,
          duration: 1150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Arrow Summit snap & Target pop
      Animated.parallel([
        Animated.spring(arrowScale, {
          toValue: 1,
          friction: 5,
          tension: 110,
          useNativeDriver: true,
        }),
        Animated.spring(targetRingScale, {
          toValue: 1,
          friction: 4,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),

      // Step 3: Typography Spring Reveal
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Haptic tap right when arrow summit snaps
    const hapticTimer = setTimeout(() => {
      try {
        Vibration.vibrate(22);
      } catch {}
    }, 1150);

    // Step 4: Smooth upward glide and dissolve into workspace
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateYExit, {
          toValue: -SCREEN_HEIGHT * 0.4,
          duration: 380,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onBootComplete();
      });
    }, durationMs);

    return () => {
      clearTimeout(hapticTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const bgColor = isDarkMode ? "#0B0F19" : "#EAEBED";
  const taskTextColor = isDarkMode ? "#F8FAFC" : "#182230";
  const pulseTextColor = isDarkMode ? "#34D399" : "#10B981";

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          backgroundColor: bgColor,
          opacity: splashOpacity,
          transform: [{ translateY: translateYExit }],
        },
      ]}
      pointerEvents="auto"
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={bgColor}
      />

      {/* Main Logo Stage with Camera Tracking */}
      <Animated.View
        style={[
          styles.cameraStage,
          {
            transform: [
              { scale: cameraScale },
              { translateX: cameraTranslateX },
              { translateY: cameraTranslateY },
            ],
          },
        ]}
      >
        {/* Pulse Line Vector Stage */}
        <View style={styles.vectorStage}>
          {SEGMENTS.map((seg, i) => {
            const dx = seg.to.x - seg.from.x;
            const dy = seg.to.y - seg.from.y;
            const length = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            const midX = (seg.from.x + seg.to.x) / 2;
            const midY = (seg.from.y + seg.to.y) / 2;

            return (
              <Animated.View
                key={`seg-${i}`}
                style={[
                  styles.segmentLine,
                  {
                    left: midX - length / 2,
                    top: midY - STROKE_WIDTH / 2,
                    width: length,
                    height: STROKE_WIDTH,
                    borderRadius: STROKE_WIDTH / 2,
                    backgroundColor: seg.color,
                    transform: [
                      { rotate: `${angle}rad` },
                      { scaleX: segProgress[i] },
                    ],
                  },
                ]}
              />
            );
          })}

          {/* Smooth Joint Dots for Perfect Round Joins */}
          {POINTS.map((pt, i) => {
            const color =
              i === 0
                ? SEGMENTS[0].color
                : i >= SEGMENTS.length
                ? SEGMENTS[SEGMENTS.length - 1].color
                : SEGMENTS[i].color;

            return (
              <Animated.View
                key={`joint-${i}`}
                style={[
                  styles.jointDot,
                  {
                    left: pt.x - STROKE_WIDTH / 2,
                    top: pt.y - STROKE_WIDTH / 2,
                    width: STROKE_WIDTH,
                    height: STROKE_WIDTH,
                    borderRadius: STROKE_WIDTH / 2,
                    backgroundColor: color,
                    opacity: jointOpacities[i],
                  },
                ]}
              />
            );
          })}

          {/* Arrowhead Guide Wings (Horizontal & Vertical at P7) */}
          <Animated.View
            style={[
              styles.arrowWing,
              {
                left: POINTS[7].x - 30,
                top: POINTS[7].y - STROKE_WIDTH / 2,
                width: 30,
                height: STROKE_WIDTH,
                borderRadius: STROKE_WIDTH / 2,
                backgroundColor: "#10B981",
                transform: [{ scale: arrowScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.arrowWing,
              {
                left: POINTS[7].x - STROKE_WIDTH / 2,
                top: POINTS[7].y,
                width: STROKE_WIDTH,
                height: 30,
                borderRadius: STROKE_WIDTH / 2,
                backgroundColor: "#10B981",
                transform: [{ scale: arrowScale }],
              },
            ]}
          />

          {/* Concentric Target Ring Aperture at Summit P7 */}
          <Animated.View
            style={[
              styles.targetRingOuter,
              {
                left: POINTS[7].x - 14,
                top: POINTS[7].y - 14,
                borderColor: "#10B981",
                transform: [{ scale: targetRingScale }],
              },
            ]}
          >
            {/* Inner Hollow Aperture showing solid background */}
            <View
              style={[
                styles.targetRingInner,
                { backgroundColor: bgColor },
              ]}
            />
          </Animated.View>
        </View>

        {/* 100% Native Vector Typography */}
        <Animated.View
          style={[
            styles.typographyContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandText}>
            <Text style={[styles.taskText, { color: taskTextColor }]}>Task</Text>
            <Text style={[styles.pulseText, { color: pulseTextColor }]}>Pulse</Text>
          </Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraStage: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
    height: 340,
  },
  vectorStage: {
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    position: "relative",
  },
  segmentLine: {
    position: "absolute",
  },
  jointDot: {
    position: "absolute",
  },
  arrowWing: {
    position: "absolute",
  },
  targetRingOuter: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  targetRingInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  typographyContainer: {
    marginTop: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.8,
    includeFontPadding: false,
  },
  taskText: {
    fontWeight: "800",
  },
  pulseText: {
    fontWeight: "800",
  },
});
