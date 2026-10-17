import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
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
import { getSuggestions, searchMerchants } from "../../mock";
import { useMallManagement } from "../../utils";

const SearchScreen = ({ navigation }) => {
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
      const response = searchMerchants(selectedMall.slug, selectedMall.capabilities || {}, trimmed);
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

  const suggestions = getSuggestions(selectedMall.slug);

  const openResult = (merchant) => {
    navigation.navigate("ProfilePlaceholder", {
      title: merchant.name,
      message: `${merchant.category} · ${merchant.floor}. Merchant detail is coming soon.`,
    });
  };

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
            placeholder={`Search ${selectedMall.name}`}
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
            <SectionHeader title="Try searching for" />
            <View style={styles.suggestionList}>
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

        {status === "ready" && results.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="search-outline" size={48} color={MallMateTheme.color.primary} />}
            title="No results"
            message={`Nothing at ${selectedMall.name} matches “${query.trim()}”. Try another keyword.`}
          />
        ) : null}

        {status === "ready" && results.length > 0 ? (
          <>
            <SectionHeader title={`${results.length} result${results.length === 1 ? "" : "s"}`} />
            <View style={styles.suggestionList}>
              {results.map((merchant) => (
                <ListRow
                  key={merchant.id}
                  title={merchant.name}
                  subtitle={`${merchant.category}${merchant.cuisine ? ` · ${merchant.cuisine}` : ""} · ${merchant.floor}`}
                  leading={
                    <Ionicons
                      name="storefront-outline"
                      size={20}
                      color={MallMateTheme.color.primary}
                    />
                  }
                  onPress={() => openResult(merchant)}
                  style={styles.row}
                />
              ))}
            </View>
          </>
        ) : null}
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
  suggestionList: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
});

export default SearchScreen;
