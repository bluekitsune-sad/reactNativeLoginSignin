import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { formatOrderDateTime, getOrderById } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Order detail + status timeline (SCREEN_INVENTORY 40) on mock data.
 * Timeline uses the PRD 5.10 state names, shows each reached state with
 * its timestamp, and clearly separates pending (in-flight) vs confirmed
 * vs terminal states via StatusChip tone. Display only — no cancellation
 * actions, no payment logic (blocked).
 */
const OrderDetailScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const orderId = route?.params?.orderId;
  const response = getOrderById(selectedMall.slug, selectedMall.capabilities || {}, orderId);
  const order = response.data;

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
        Order {order?.code || ""}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="receipt-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title="Order unavailable"
          message={response.message || "We couldn't load that order."}
        />
      </SafeAreaView>
    );
  }

  const placedLabel = formatOrderDateTime(order.placedAt);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={order.id} contentContainerStyle={styles.content}>
        <View style={styles.statusRow}>
          <View style={styles.statusBody}>
            <Text style={styles.merchant}>{order.merchantName}</Text>
            <Text style={styles.meta}>
              {order.fulfilment}
              {placedLabel ? ` · ${placedLabel}` : ""}
            </Text>
          </View>
          <StatusChip label={order.currentMeta.label} tone={order.currentMeta.tone} />
        </View>
        <Text style={styles.statusDescription}>{order.currentMeta.description}</Text>

        <Text style={styles.sectionTitle}>Status timeline</Text>
        <Card style={styles.timelineCard}>
          {order.history.map((entry, index) => {
            const isCurrent = index === order.history.length - 1;
            const entryLabel = formatOrderDateTime(entry.at);
            return (
              <View key={`${entry.state}-${entry.at}`} style={styles.timelineRow}>
                <View style={styles.timelineGutter}>
                  <View style={[styles.timelineDot, isCurrent && styles.timelineDotCurrent]} />
                  {!isCurrent ? <View style={styles.timelineLine} /> : null}
                </View>
                <View style={styles.timelineBody}>
                  <Text style={[styles.timelineState, isCurrent && styles.timelineStateCurrent]}>
                    {entry.state.split("_").join(" ")}
                  </Text>
                  {entryLabel ? <Text style={styles.timelineTime}>{entryLabel}</Text> : null}
                </View>
                {isCurrent ? (
                  <StatusChip
                    label="Current"
                    tone={order.currentMeta.tone}
                    style={styles.currentChip}
                  />
                ) : null}
              </View>
            );
          })}
          {order.nextState ? (
            <View style={styles.timelineRow}>
              <View style={styles.timelineGutter}>
                <View style={styles.timelineDotPending} />
              </View>
              <View style={styles.timelineBody}>
                <Text style={styles.timelineStatePending}>
                  {order.nextState.split("_").join(" ")}
                </Text>
                <Text style={styles.timelineTime}>Expected next step (preview only)</Text>
              </View>
            </View>
          ) : null}
        </Card>

        <Text style={styles.sectionTitle}>Items</Text>
        <Card style={styles.itemsCard}>
          {order.itemLines.map((item) => (
            <View key={item.name} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} × {item.qty}
              </Text>
              <Text style={styles.itemPrice}>{item.lineLabel}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.totalLabel}</Text>
          </View>
        </Card>

        <Card style={styles.noteCard}>
          <Text style={styles.note}>
            Preview build — mock order on mock data. Payment proof, cancellations, refunds and live
            tracking aren't enabled yet.
          </Text>
        </Card>
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
  headerMeta: {
    flex: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusBody: {
    flex: 1,
    marginRight: MallMateTheme.spacing.md,
  },
  merchant: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  meta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  statusDescription: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  sectionTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginTop: MallMateTheme.spacing.lg,
    marginBottom: MallMateTheme.spacing.sm,
  },
  timelineCard: {
    marginBottom: 0,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineGutter: {
    width: 16,
    alignItems: "center",
    marginRight: MallMateTheme.spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MallMateTheme.color.primary,
    marginTop: 6,
  },
  timelineDotCurrent: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  timelineDotPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: "transparent",
    marginTop: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: MallMateTheme.color.border,
    marginVertical: 2,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: MallMateTheme.spacing.md,
  },
  timelineState: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: 2,
  },
  timelineStateCurrent: {
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  timelineStatePending: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: 2,
  },
  timelineTime: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  currentChip: {
    marginLeft: MallMateTheme.spacing.sm,
  },
  itemsCard: {
    marginBottom: 0,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: MallMateTheme.spacing.sm,
  },
  itemName: {
    flex: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginRight: MallMateTheme.spacing.md,
  },
  itemPrice: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    fontVariant: ["tabular-nums"],
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: MallMateTheme.color.border,
    paddingTop: MallMateTheme.spacing.md,
    marginTop: MallMateTheme.spacing.xs,
  },
  totalLabel: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  totalValue: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    fontVariant: ["tabular-nums"],
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

export default OrderDetailScreen;
