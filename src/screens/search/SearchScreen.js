import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EmptyState,
  ErrorState,
  FilterSheet,
  ListRow,
  LoadingState,
  SectionHeader,
  TextInput,
} from "../../components";
import { MallMateTheme } from "../../constants";
import {
  EMPTY_FILTERS,
  PRICE_BAND_LABELS,
  applyMerchantFilters,
  collectFilterOptions,
  countActiveFilters,
  getSuggestions,
  searchMerchants,
} from "../../mock";
import { useMallManagement } from "../../utils";

const SearchScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [rawResults, setRawResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [sheetVisible, setSheetVisible] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(
    (rawQuery) => {
      const trimmed = (rawQuery || "").trim();
      if (!trimmed) {
        setStatus("idle");
        setRawResults([]);
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
        setRawResults([]);
        return;
      }
      setErrorMessage(null);
      setRawResults(response.data);
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

  useEffect(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setDraftFilters(EMPTY_FILTERS);
  }, [selectedMall.slug]);

  const filterOptions = useMemo(() => {
    const options = collectFilterOptions(rawResults);
    return {
      categories: options.categories.map((value) => ({ value, label: value })),
      cuisines: options.cuisines.map((value) => ({ value, label: value })),
      floors: options.floors.map((value) => ({ value, label: value })),
      priceBands: options.priceBands.map((value) => ({
        value,
        label: PRICE_BAND_LABELS[value] || value,
      })),
    };
  }, [rawResults]);

  const filteredResults = useMemo(
    () => applyMerchantFilters(rawResults, appliedFilters),
    [rawResults, appliedFilters],
  );
  const draftResultCount = useMemo(
    () => applyMerchantFilters(rawResults, draftFilters).length,
    [rawResults, draftFilters],
  );
  const activeFilterCount = countActiveFilters(appliedFilters);
  const suggestions = getSuggestions(selectedMall.slug);

  const openSheet = () => {
    setDraftFilters(appliedFilters);
    setSheetVisible(true);
  };

  const applyDraft = () => {
    setAppliedFilters(draftFilters);
    setSheetVisible(false);
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSheetVisible(false);
  };

  const openResult = (merchant) => {
    navigation.navigate("MerchantDetail", { merchantId: merchant.id });
  };

  const showResults = status === "ready";
  const filtersApply = showResults && activeFilterCount > 0;

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
        {showResults ? (
          <Pressable
            onPress={openSheet}
            accessibilityRole="button"
            accessibilityLabel={
              activeFilterCount ? `Filters, ${activeFilterCount} active` : "Open filters"
            }
            style={({ pressed }) => [styles.filterButton, pressed && styles.filterButtonPressed]}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={
                activeFilterCount ? MallMateTheme.color.primary : MallMateTheme.color.textPrimary
              }
            />
            {activeFilterCount ? (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
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

        {showResults && rawResults.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="search-outline" size={48} color={MallMateTheme.color.primary} />}
            title="No results"
            message={`Nothing at ${selectedMall.name} matches “${query.trim()}”. Try another keyword.`}
          />
        ) : null}

        {showResults && rawResults.length > 0 && filteredResults.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="options-outline" size={48} color={MallMateTheme.color.primary} />}
            title="No matches with these filters"
            message="Try removing a filter to see more results."
          />
        ) : null}

        {showResults && filteredResults.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <SectionHeader
                title={`${filteredResults.length} result${filteredResults.length === 1 ? "" : "s"}`}
                style={styles.resultsHeaderSection}
              />
              {filtersApply ? (
                <Pressable
                  onPress={clearFilters}
                  accessibilityRole="button"
                  accessibilityLabel="Clear all filters"
                  hitSlop={MallMateTheme.spacing.sm}
                  style={styles.clearFilters}
                >
                  <Text style={styles.clearFiltersText}>Clear filters</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.suggestionList}>
              {filteredResults.map((merchant) => (
                <ListRow
                  key={merchant.id}
                  title={merchant.name}
                  subtitle={`${merchant.category}${merchant.cuisine ? ` · ${merchant.cuisine}` : ""} · ${merchant.floor}${merchant.openNow ? " · Open now" : ""}`}
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

      <FilterSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onApply={applyDraft}
        onClear={clearFilters}
        options={filterOptions}
        filters={draftFilters}
        onChange={setDraftFilters}
        resultCount={draftResultCount}
      />
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
  filterButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    marginLeft: MallMateTheme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surface,
  },
  filterButtonPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  filterCountBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: MallMateTheme.color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterCountText: {
    color: MallMateTheme.color.background,
    fontSize: 10,
    fontFamily: MallMateTheme.fontFamily.bold,
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
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultsHeaderSection: {
    flex: 1,
  },
  clearFilters: {
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.sm,
  },
  clearFiltersText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
});

export default SearchScreen;
