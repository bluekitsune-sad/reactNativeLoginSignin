import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, EmptyState, ListRow, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getOfferById, getOfferHeadline, getOfferValidity } from "../../mock";

/**
 * Offer detail + terms sheet (PRD 5.8, SCREEN_INVENTORY 26) on mock data:
 * discount headline by type (%, fixed amount, BOGO), merchant context,
 * validity dates, eligibility list and a bottom-sheet with the full
 * terms. Expired offers resolve upstream to null, so this screen shows an
 * unavailable state for them. No redemption/coupon logic (blocked) — the
 * offer is display-only.
 */
const OfferDetailScreen = ({ navigation, route }) => {
  const offerId = route?.params?.offerId;
  const offer = getOfferById(offerId);
  const [termsVisible, setTermsVisible] = useState(false);

  const header = (
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
      <Text style={styles.headerMeta} numberOfLines={1}>
        {t("offer.headerTitle")}
      </Text>
    </View>
  );

  if (!offer) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="pricetag-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title={t("offer.unavailableTitle")}
          message={t("offer.unavailableMessage")}
        />
      </SafeAreaView>
    );
  }

  const validity = getOfferValidity(offer);
  const terms = offer.terms || [];
  const eligibility = offer.eligibility || [];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.headline} accessibilityRole="header">
            {getOfferHeadline(offer)}
          </Text>
          <Text style={styles.title}>{offer.title}</Text>
          <Pressable
            onPress={() => navigation.navigate("MerchantDetail", { merchantId: offer.merchantId })}
            accessibilityRole="button"
            accessibilityLabel={t("offer.openMerchantA11y", { merchant: offer.merchantName })}
            style={({ pressed }) => [styles.merchantRow, pressed && styles.merchantRowPressed]}
          >
            <Ionicons
              name="storefront-outline"
              size={18}
              color={MallMateTheme.color.primary}
              style={styles.merchantIcon}
            />
            <Text style={styles.merchantName}>{offer.merchantName}</Text>
            <Ionicons name="chevron-forward" size={18} color={MallMateTheme.color.textMuted} />
          </Pressable>
          {offer.description ? <Text style={styles.description}>{offer.description}</Text> : null}
          <View style={styles.statusRow}>
            <StatusChip label={t("offer.activeChip")} tone="success" />
            {validity ? <Text style={styles.validity}>{validity}</Text> : null}
          </View>
        </Card>

        {eligibility.length ? (
          <>
            <SectionHeader title={t("offer.eligibility")} style={styles.section} />
            <Card>
              {eligibility.map((line) => (
                <View key={line} style={styles.bulletRow}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={MallMateTheme.color.primary}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader title={t("offer.termsSection")} style={styles.section} />
        <ListRow
          title={t("offer.viewTerms")}
          subtitle={
            terms.length === 1
              ? t("offer.termsCountOne", { count: terms.length })
              : t("offer.termsCountMany", { count: terms.length })
          }
          leading={
            <Ionicons name="document-text-outline" size={20} color={MallMateTheme.color.primary} />
          }
          onPress={() => setTermsVisible(true)}
          style={styles.row}
        />

        <Text style={styles.note}>{t("offer.checkoutNote")}</Text>
      </ScrollView>

      <Modal
        visible={termsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTermsVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setTermsVisible(false)}
          accessibilityRole="button"
          accessibilityLabel={t("offer.closeTermsA11y")}
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t("offer.sheetTitle")}</Text>
            <Pressable
              onPress={() => setTermsVisible(false)}
              accessibilityRole="button"
              accessibilityLabel={t("offer.closeTermsA11y")}
              hitSlop={MallMateTheme.spacing.sm}
              style={styles.sheetClose}
            >
              <Ionicons name="close-outline" size={26} color={MallMateTheme.color.textPrimary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            {terms.length ? (
              terms.map((term) => (
                <View key={term} style={styles.bulletRow}>
                  <Ionicons
                    name="ellipse-outline"
                    size={8}
                    color={MallMateTheme.color.textMuted}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{term}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bulletText}>{t("offer.noExtraTerms")}</Text>
            )}
            {validity ? (
              <Text style={styles.sheetValidity}>{t("offer.validityLabel", { validity })}</Text>
            ) : null}
          </ScrollView>
          <Button
            label={t("common.close")}
            variant="secondary"
            onPress={() => setTermsVisible(false)}
            style={styles.sheetButton}
          />
        </View>
      </Modal>
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
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  headline: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.h1.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
    textTransform: "uppercase",
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginTop: MallMateTheme.spacing.xs,
  },
  merchantRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MallMateTheme.touchTarget.min,
    marginTop: MallMateTheme.spacing.sm,
    paddingHorizontal: MallMateTheme.spacing.sm,
    marginHorizontal: -MallMateTheme.spacing.sm,
    borderRadius: MallMateTheme.radius.control,
  },
  merchantRowPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  merchantIcon: {
    marginEnd: MallMateTheme.spacing.sm,
  },
  merchantName: {
    flex: 1,
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  description: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: MallMateTheme.spacing.md,
  },
  validity: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: MallMateTheme.spacing.sm,
  },
  bulletIcon: {
    marginEnd: MallMateTheme.spacing.sm,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  row: {
    marginBottom: 0,
  },
  note: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
    marginTop: MallMateTheme.spacing.lg,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    backgroundColor: MallMateTheme.color.surface,
    borderTopLeftRadius: MallMateTheme.radius.sheet,
    borderTopRightRadius: MallMateTheme.radius.sheet,
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xl,
    maxHeight: "70%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: MallMateTheme.color.border,
    marginTop: MallMateTheme.spacing.sm,
    marginBottom: MallMateTheme.spacing.sm,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: MallMateTheme.spacing.sm,
  },
  sheetTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  sheetClose: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBody: {
    paddingBottom: MallMateTheme.spacing.md,
  },
  sheetValidity: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  sheetButton: {
    marginTop: MallMateTheme.spacing.sm,
  },
});

export default OfferDetailScreen;
