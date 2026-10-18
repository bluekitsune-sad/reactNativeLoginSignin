import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EmptyState,
  ErrorState,
  ListRow,
  LoadingState,
  SectionHeader,
  TextInput,
} from "../../components";
import { MallMateTheme } from "../../constants";
import { getDestinationSuggestions, searchDestinations } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Destination search (SCREEN_INVENTORY 45) over published POIs on mock
 * data. Idle suggestions, debounced search, distinct empty-results vs
 * error states (query "!error" simulates a recoverable failure). Selecting
 * a result opens the destination detail. Capability-gated upstream — the
 * mock resolver returns an error envelope when indoor_navigation is off.
 */
const DestinationSearchScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(
    (rawQuery) => {
      const trimmed = (rawQuery || "").trim();
      if (!trimmed) {
        setStatus("idle");
        setResults([]);
        setErrorMessage(null);
        return;
      }
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setStatus("loading");
      const response = searchDestinations(
        selectedMall.slug,
        selectedMall.capabilities || {},
        trimmed,
      );
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (!response.status) {
        setStatus("error");
        setErrorMessage(response.message);
        setResults([]);
        return;
      }
      setErrorMessage(null);
      setResults(response.data);
      setStatus("ready");
    },
    [selectedMall.slug, selectedMall.capabilities],
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  const suggestions = getDestinationSuggestions(selectedMall.slug);
  const showResults = status === "ready";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={MallMateTheme.spacing.sm}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </Pressable>
        <View style={styles.searchWrapper}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Where are you headed?"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>
      </View>
      <ScrollView
        key={selectedMall.slug}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {status === "idle" ? (
          <>
            <SectionHeader title="Popular places" />
            <View style={styles.list}>
              {suggestions.map((suggestion) => (
                <ListRow
                  key={suggestion}
                  title={suggestion}
                  leading={
                    <Ionicons
                      name="search-outline"
                      size={18}
                      color={MallMateTheme.color.textMuted}
                    />
                  }
                  showChevron={false}
                  onPress={() => setQuery(suggestion)}
                  style={styles.row}
                />
              ))}
            </View>
            {suggestions.length === 0 ? (
              <EmptyState
                icon={
                  <Ionicons
                    name="navigate-outline"
                    size={48}
                    color={MallMateTheme.color.textMuted}
                  />
                }
                title="No destinations yet"
                message={`Indoor destinations haven't been published for ${selectedMall.name} yet.`}
              />
            ) : null}
          </>
        ) : null}

        {status === "loading" ? <LoadingState message="Searching…" /> : null}

        {status === "error" ? (
          <ErrorState
            title="Search failed"
            message={errorMessage || "Something went wrong while searching."}
            onRetry={() => runSearch(query)}
          />
        ) : null}

        {showResults && results.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="search-outline" size={48} color={MallMateTheme.color.primary} />}
            title="No results"
            message={`Nothing on the published maps matches “${query.trim()}”. Try another keyword.`}
          />
        ) : null}

        {showResults && results.length > 0 ? (
          <>
            <SectionHeader title={`${results.length} result${results.length === 1 ? "" : "s"}`} />
            <View style={styles.list}>
              {results.map((destination) => (
                <ListRow
                  key={destination.id}
                  title={destination.name}
                  subtitle={`${destination.category} · ${destination.floorName}`}
                  leading={
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={MallMateTheme.color.primary}
                    />
                  }
                  onPress={() =>
                    navigation.navigate("DestinationDetail", { destinationId: destination.id })
                  }
                  style={styles.row}
                />
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.disclaimer}>
          Static preview — routes are illustrative. No live positioning or turn-by-turn navigation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  backButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
    marginRight: MallMateTheme.spacing.sm,
  },
  searchWrapper: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  list: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  disclaimer: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.lg,
  },
});

export default DestinationSearchScreen;
