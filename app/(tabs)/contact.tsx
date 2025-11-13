import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const BG = '#0B1313';
const PANEL = '#0E1717';
const PEACH = '#E7C4A3';
const TEXT = 'rgba(255,255,255,0.92)';
const MUTED = 'rgba(255,255,255,0.72)';

export default function ContactScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* NAVBAR */}
        <View style={styles.nav}>
          <View style={styles.brandRow}>
            <View style={styles.logoFlame} />
            <Text style={styles.brand}>GAEL'S CRAVES</Text>
          </View>
          <View style={styles.navRight}>
            <Text style={styles.navLink}>Home</Text>
            <Text style={styles.navLink}>About</Text>
            <Text style={styles.navLink}>Blog</Text>
            <Text style={[styles.navLink, styles.navLinkActive]}>Contact us</Text>
            <Pressable style={styles.loginBtn}>
              <Text style={styles.loginText}>LOGIN</Text>
            </Pressable>
          </View>
        </View>

        {/* RESERVATION FORM PANEL */}
        <View style={styles.formPanel}>
          <Text style={styles.formTitle}>Place An Order</Text>
          <Text style={styles.formSubtitle}>
            Place an order at Gael&apos;s Craves, where bold flavors meet healthy nutritious meals.
          </Text>

          <View
            style={[
              styles.formGrid,
              { flexDirection: isWide ? 'row' : 'column', flexWrap: 'wrap' },
            ]}
          >
            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>First Name*</Text>
              <TextInput style={styles.input} placeholder="Gael" placeholderTextColor={MUTED} />
            </View>
            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>Last Name*</Text>
              <TextInput style={styles.input} placeholder="Craves" placeholderTextColor={MUTED} />
            </View>

            <View style={styles.fieldWrapFull}>
              <Text style={styles.label}>Email Address*</Text>
              <TextInput
                style={styles.input}
                placeholder="abyss@csumb.edu"
                keyboardType="email-address"
                placeholderTextColor={MUTED}
              />
            </View>

            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>Phone*</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (831) 582-3000"
                keyboardType="phone-pad"
                placeholderTextColor={MUTED}
              />
            </View>
            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>Time*</Text>
              <TextInput
                style={styles.input}
                placeholder="12:00 PM"
                placeholderTextColor={MUTED}
              />
            </View>

            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>Date*</Text>
              <TextInput style={styles.input} placeholder="11/15/2025" placeholderTextColor={MUTED} />
            </View>
            <View style={styles.fieldWrapHalf}>
              <Text style={styles.label}>Orders*</Text>
              <TextInput style={styles.input} placeholder="0" placeholderTextColor={MUTED} />
            </View>

            <View style={styles.fieldWrapFull}>
              <Text style={styles.label}>Special Requests</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Allergies, modifications, or special custimizations..."
                placeholderTextColor={MUTED}
                multiline
              />
            </View>
          </View>

          <Pressable style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>PLACE YOUR ORDER</Text>
          </Pressable>
        </View>

        {/* DIRECT CONTACT PANEL */}
        <View style={styles.directPanel}>
          <Text style={styles.centerEyebrow}>Prefer To Reach Out Directly?</Text>
          <Text style={styles.centerTitle}>We&apos;re here to help with any questions.</Text>
          <Text style={styles.centerSub}>
            Contact our team directly for friendly, professional support, whether you&apos;re planning a
            celebration, date night, or casual meetup.
          </Text>

          <View
            style={[
              styles.contactRow,
              { flexDirection: isWide ? 'row' : 'column', justifyContent: 'space-between' },
            ]}
          >
            {/* Email */}
            <View style={styles.contactCard}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconLetter}>@</Text>
              </View>
              <Text style={styles.contactTitle}>Email Us</Text>
              <Text style={styles.contactBody}>
                Ask us a question by email and we&apos;ll respond within a few days.
              </Text>
              <Text style={styles.contactLink}>abyss@csumb.edu</Text>
            </View>

            {/* Visit */}
            <View style={styles.contactCard}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconLetter}>⌂</Text>
              </View>
              <Text style={styles.contactTitle}>Drop In</Text>
              <Text style={styles.contactBody}>
                Come visit our Soledad location and chat with our team in person.
              </Text>
              <Text style={styles.contactLink}>Get directions →</Text>
            </View>

            {/* Call */}
            <View style={styles.contactCard}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconLetter}>☎</Text>
              </View>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactBody}>
                Prefer talking it through? Call us if your question needs a quick response.
              </Text>
              <Text style={styles.contactLink}>+1 (831) 582-3000</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>GAEL'S CRAVES</Text>
          <Text style={styles.copy}>
            © {new Date().getFullYear()} Gael&apos;s Craves — All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  // NAVBAR
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoFlame: {
    width: 18,
    height: 24,
    borderRadius: 4,
    backgroundColor: PEACH,
    transform: [{ rotate: '8deg' }],
    opacity: 0.9,
  },
  brand: { color: TEXT, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  navLink: { color: TEXT, opacity: 0.85 },
  navLinkActive: { color: PEACH },
  loginBtn: {
    backgroundColor: PEACH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  loginText: { color: '#1b1b1b', fontWeight: '800' },

  // FORM PANEL
  formPanel: {
    marginTop: 10,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 28,
    borderRadius: 18,
    alignItems: 'center',
  },
  formTitle: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  formSubtitle: {
    color: MUTED,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 520,
    fontSize: 14,
  },
  formGrid: { width: '100%', maxWidth: 640, gap: 14 },
  fieldWrapHalf: { flexBasis: '48%' },
  fieldWrapFull: { flexBasis: '100%' },
  label: { color: MUTED, fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 14,
    backgroundColor: '#0B1414',
  },
  textarea: { height: 90, textAlignVertical: 'top' },
  bookBtn: {
    marginTop: 20,
    width: '100%',
    maxWidth: 640,
    borderWidth: 1,
    borderColor: PEACH,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookBtnText: { color: PEACH, fontWeight: '800', letterSpacing: 0.5 },

  // DIRECT CONTACT PANEL
  directPanel: {
    marginTop: 26,
    backgroundColor: '#0F1919',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  centerEyebrow: {
    color: PEACH,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 6,
  },
  centerTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  centerSub: {
    color: MUTED,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    maxWidth: 580,
    alignSelf: 'center',
  },
  contactRow: { gap: 18 },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: PEACH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconLetter: { color: PEACH, fontWeight: '800', fontSize: 18 },
  contactTitle: { color: TEXT, fontWeight: '800', marginBottom: 4 },
  contactBody: { color: MUTED, textAlign: 'center', fontSize: 13, marginBottom: 6 },
  contactLink: { color: PEACH, fontWeight: '700', fontSize: 13 },

  // FOOTER
  footer: {
    marginTop: 36,
    paddingTop: 18,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    gap: 6,
  },
  footerBrand: { color: TEXT, fontWeight: '800' },
  copy: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
});