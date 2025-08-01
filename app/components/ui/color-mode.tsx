"use client";

import * as React from "react";

import { ThemeProvider, useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import {
  ClientOnly,
  Flex,
  IconButton,
  Skeleton,
  Span,
  Text,
} from "@chakra-ui/react";

import type { ThemeProviderProps } from "next-themes";



export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider disableTransitionOnChange attribute="class" {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <Flex alignItems="center" spaceX="2">
        <Text display={{ base: "none", md: "initial" }} fontSize="sm">
          Change Theme Color
        </Text>
        <IconButton
          aria-label="Toggle color mode"
          ref={ref}
          size="lg"
          variant="ghost"
          onClick={toggleColorMode}
          {...props}
          css={{
            _icon: {
              width: "5",
              height: "5",
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </Flex>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        className="chakra-theme light"
        color="fg"
        colorPalette="gray"
        colorScheme="light"
        display="contents"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        className="chakra-theme dark"
        color="fg"
        colorPalette="gray"
        colorScheme="dark"
        display="contents"
        ref={ref}
        {...props}
      />
    );
  },
);
