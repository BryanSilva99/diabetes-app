import { router } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

type TabName = "index" | "explore" | "result";

const routes: { name: TabName; path: "/" | "/explore" | "/result" }[] = [
  { name: "index", path: "/" },
  { name: "explore", path: "/explore" },
  { name: "result", path: "/result" },
];

type Props = PropsWithChildren<{
  current: TabName;
}>;

export default function SwipeTabs({ children, current }: Props) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          const absX = Math.abs(gesture.dx);
          const absY = Math.abs(gesture.dy);

          return absX > 28 && absX > absY * 1.4;
        },
        onPanResponderRelease: (_, gesture) => {
          const currentIndex = routes.findIndex((route) => route.name === current);

          if (gesture.dx < -80 && currentIndex < routes.length - 1) {
            router.push(routes[currentIndex + 1].path);
          }

          if (gesture.dx > 80 && currentIndex > 0) {
            router.push(routes[currentIndex - 1].path);
          }
        },
      }),
    [current],
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
