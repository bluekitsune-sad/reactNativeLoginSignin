import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { ORDER_STATE_META, formatOrderDateTime, getOrderList } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Order history list (SCREEN_INVENTORY 41) on mock data. Display only —
 * no checkout, payments or state transitions (blocked). Capability-gated
 * on online_ordering; pending vs confirmed is surfaced via StatusChip
 * tone per the PRD 5.10 state names. Tapping an order opens the detail
 * timeline.
 */
const OrderHistoryScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const response = getOrderList(selectedMall.slug, selectedMall.capabilities || {});
  const orders = response.data;

  const header = (
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
      <Text style={styles.headerMeta} numberOfLines={1}>
        {selectedMall.name}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your orders</Text>

        {!response.status ? (
          <EmptyState
            icon={
              <Ionicons name="receipt-outline" size={48} color={MallMateTheme.color.textMuted} />
            }
            title="Orders unavailable"
            message={response.message}
          />
        ) : null}

        {response.status && orders.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="receipt-outline" size={48} color={MallMateTheme.color.primary} />}
            title="No orders yet"
            message={`Orders from ${selectedMall.name} will appear here after you place one.`}
          />
        ) : null}

        {response.status && orders.length > 0 ? (
          <View style={styles.list}>
            {orders.map((order) => {
              const current = order.history[order.history.length - 1];
              const meta = ORDER_STATE_META[current.state];
              const placedLabel = formatOrderDateTime(order.placedAt);
              return (
                <ListRow
                  key={order.id}
                  title={order.merchantName}
                  subtitle={`${order.code} · ${order.fulfilment}${placedLabel ? ` · ${placedLabel}` : ""}`}
                  trailing={<StatusChip label={meta.label} tone={meta.tone} />}
                  leading={
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color={MallMateTheme.color.primary}
                    />
                  }
                  onPress={() => navigation.navigate("OrderDetail", { orderId: order.id })}
                  style={styles.row}
                />
              );
            })}
          </View>
        ) : null}

        {response.status && orders.length > 0 ? (
          <Card style={styles.noteCard}>
            <Text style={styles.note}>
              Preview build — these are mock orders on mock data. Checkout, payments and live status
              updates aren't enabled yet.
            </Text>
          </Card>
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
    marginEnd: MallMateTheme.spacing.sm,
  },
  headerMeta: {
    flex: 1,
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: MallMateTheme.spacing.lg,
  },
  list: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  noteCard: {
    marginTop: MallMateTheme.spacing.lg,
  },
  note: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    lineHeight: 18,
  },
});

export default OrderHistoryScreen;
