import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ErrorState, ListRow, LoadingState, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { LIST_KIND_META, fetchMerchantListPage, isCapabilityVisible } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Full restaurant / outlet list screens (SCREEN_INVENTORY 21–22), driven by
 * paginated mock pages. One component, two stack routes ("RestaurantList",
 * "OutletList") selected via `route.params.kind`. Handles capability
 * gating, initial/loading/error/empty states, infinite scroll with an
 * inline load-more error + retry, and pull-to-refresh. Tapping a merchant
 * opens the placeholder until merchant detail lands.
 */
const MerchantListScreen = ({ navigation, route }) => {
  const kind = route?.params?.kind === "outlets" ? "outlets" : "restaurants";
  const meta = LIST_KIND_META[kind];
  const { selectedMall } = useMallManagement();
  const capabilityMap = selectedMall.capabilities || {};
  const available = isCapabilityVisible(capabilityMap, meta.capability);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const requestIdRef = useRef(0);

  const loadFirstPage = useCallback(
    async (isRefresh = false) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setStatus("loading");
        setErrorMessage(null);
      }
      const response = await fetchMerchantListPage({
        mallSlug: selectedMall.slug,
        capabilityMap,
        kind,
        page: 1,
      });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setRefreshing(false);
      if (!response.status) {
        if (!isRefresh) {
          setItems([]);
          setHasMore(false);
          setTotal(0);
          setStatus("error");
          setErrorMessage(response.message);
        }
        return;
      }
      const { items: firstPage, hasMore: more, total: count } = response.data;
      setItems(firstPage);
      setPage(1);
      setHasMore(more);
      setTotal(count);
      setLoadMoreError(null);
      setStatus(firstPage.length ? "ready" : "empty");
    },
    [capabilityMap, kind, selectedMall.slug],
  );

  const loadNextPage = useCallback(async () => {
    if (loadingMore || !hasMore || status !== "ready") {
      return;
    }
    setLoadingMore(true);
    setLoadMoreError(null);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const response = await fetchMerchantListPage({
      mallSlug: selectedMall.slug,
      capabilityMap,
      kind,
      page: page + 1,
    });
    if (requestId !== requestIdRef.current) {
      return;
    }
    setLoadingMore(false);
    if (!response.status) {
      setLoadMoreError(response.message);
      return;
    }
    const { items: nextPage, page: nextPageNumber, hasMore: more } = response.data;
    setItems((previous) => [...previous, ...nextPage]);
    setPage(nextPageNumber);
    setHasMore(more);
  }, [capabilityMap, hasMore, kind, loadingMore, page, selectedMall.slug, status]);

  useEffect(() => {
    requestIdRef.current += 1;
    setItems([]);
    setPage(1);
    setHasMore(false);
    setTotal(0);
    setErrorMessage(null);
    setLoadMoreError(null);
    setLoadingMore(false);
    setRefreshing(false);
    if (available) {
      loadFirstPage();
    } else {
      setStatus("empty");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMall.slug, kind, available]);

  const openMerchant = (merchant) => {
    navigation.navigate("MerchantDetail", { merchantId: merchant.id });
  };

  const renderMerchant = ({ item }) => (
    <ListRow
      title={item.name}
      subtitle={`${item.category}${item.cuisine ? ` · ${item.cuisine}` : ""} · ${item.floor}`}
      leading={<Ionicons name={meta.icon} size={20} color={MallMateTheme.color.primary} />}
      trailing={
        <StatusChip
          label={item.openNow ? t("explore.open") : t("explore.closed")}
          tone={item.openNow ? "success" : "muted"}
        />
      }
      onPress={() => openMerchant(item)}
      style={styles.row}
    />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerStatus} accessibilityLabel={t("explore.loadingMoreA11y")}>
          <ActivityIndicator size="small" color={MallMateTheme.color.primary} />
          <Text style={styles.footerText}>{t("explore.loadingMore")}</Text>
        </View>
      );
    }
    if (loadMoreError) {
      return (
        <View style={styles.footerStatus}>
          <Text style={styles.footerErrorText}>{loadMoreError}</Text>
          <Pressable
            onPress={loadNextPage}
            accessibilityRole="button"
            accessibilityLabel={t("explore.retryLoadingMore")}
            hitSlop={MallMateTheme.spacing.sm}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          >
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      );
    }
    if (!hasMore && items.length > 0) {
      return (
        <Text style={styles.footerEnd}>
          {t(total === 1 ? "explore.listEndOne" : "explore.listEndMany", {
            total,
            mall: selectedMall.name,
          })}
        </Text>
      );
    }
    return <View style={styles.footerSpacer} />;
  };

  const unavailableMessage = meta.unavailableMessage(selectedMall.name);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t("common.goBack")}
          hitSlop={MallMateTheme.spacing.sm}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </Pressable>
        <View style={styles.headerBody}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            {meta.title}
          </Text>
          <Text style={styles.headerMeta} numberOfLines={1}>
            {selectedMall.name}
          </Text>
        </View>
      </View>

      {!available ? (
        <EmptyState
          icon={<Ionicons name={meta.icon} size={48} color={MallMateTheme.color.textMuted} />}
          title={meta.unavailableTitle}
          message={unavailableMessage}
        />
      ) : status === "loading" ? (
        <LoadingState message={t("explore.loadingList", { list: meta.title.toLowerCase() })} />
      ) : status === "error" ? (
        <ErrorState
          title={t("explore.loadFailedTitle", { list: meta.title.toLowerCase() })}
          message={errorMessage || t("explore.loadFailedMessage")}
          onRetry={() => loadFirstPage()}
        />
      ) : status === "empty" ? (
        <EmptyState
          icon={<Ionicons name={meta.icon} size={48} color={MallMateTheme.color.primary} />}
          title={meta.emptyTitle}
          message={meta.emptyMessage(selectedMall.name)}
        />
      ) : (
        <FlatList
          key={`${selectedMall.slug}:${kind}`}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderMerchant}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReachedThreshold={0.4}
          onEndReached={loadNextPage}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFirstPage(true)}
              tintColor={MallMateTheme.color.primary}
              colors={[MallMateTheme.color.primary]}
            />
          }
        />
      )}
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
    marginEnd: MallMateTheme.spacing.sm,
  },
  headerBody: {
    flex: 1,
  },
  headerTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  listContent: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  row: {
    marginBottom: 0,
  },
  separator: {
    height: MallMateTheme.spacing.sm,
  },
  footerStatus: {
    alignItems: "center",
    paddingVertical: MallMateTheme.spacing.lg,
  },
  footerText: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  footerErrorText: {
    color: MallMateTheme.color.error,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
    marginBottom: MallMateTheme.spacing.sm,
    paddingHorizontal: MallMateTheme.spacing.lg,
  },
  retryButton: {
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  retryButtonPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  retryButtonText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  footerEnd: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
    paddingVertical: MallMateTheme.spacing.lg,
  },
  footerSpacer: {
    height: MallMateTheme.spacing.lg,
  },
});

export default MerchantListScreen;
