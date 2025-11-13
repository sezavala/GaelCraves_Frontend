import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const BG = '#0B1313';
const PANEL = '#0E1717';
const PEACH = '#E7C4A3';
const TEXT = 'rgba(255,255,255,0.92)';
const MUTED = 'rgba(255,255,255,0.72)';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1000;

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
            <Text style={[styles.navLink, styles.navLinkActive]}>About</Text>
            <Text style={styles.navLink}>Menu</Text>
            <Text style={styles.navLink}>Contact us</Text>
            <Pressable style={styles.loginBtn}>
              <Text style={styles.loginText}>LOGIN</Text>
            </Pressable>
          </View>
        </View>

        {/* HERO / INTRO */}
        <View style={[styles.panel, { flexDirection: isWide ? 'row' : 'column' }]}>
          {/* Left copy */}
          <View style={[styles.col, { flex: isWide ? 1.1 : undefined }]}>
            <Text style={styles.eyebrow}>Why choose us</Text>
            <Text style={styles.h1}>
              Your Favorite Meals{'\n'}
              <Text style={styles.accent}>That Meet Your Protein Goals</Text>
            </Text>
            <Text style={styles.sub}>
              Food is a journey of flavors that connect people and create joy. We deliver fresh
              and unforgettable meals crafted with passion and detail for the perfect bite.
            </Text>
            <View style={styles.ctaRow}>
              <Pressable style={styles.primaryOutline}>
                <Text style={styles.primaryOutlineText}>PLACE YOUR ORDER</Text>
              </Pressable>
            </View>
          </View>

          {/* Right visuals: badge + collage */}
          <View style={[styles.col, { flex: isWide ? 1 : undefined }]}>
            <View style={styles.visualStage}>
              {/* Badge */}
              <View style={styles.badgeWrap}>
                <View style={styles.badge}>
                  <Text style={styles.badgeBig}>2</Text>
                  <Text style={styles.badgeSmall}>Years Experience</Text>
                </View>
              </View>

              {/* Collage */}
              <Image
                //source={{ uri: 'link goes here' }}
                style={[styles.cardImg, styles.cardImgMain]}
                resizeMode="cover"
              />
              <Image
                //source={{ uri: 'link goes here' }}
                style={[styles.cardImg, styles.cardImgInset]}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* FEATURES ROW */}
        <View style={styles.panel}>
          <Text style={styles.centerEyebrow}>WHY CHOOSE US</Text>
          <Text style={styles.centerTitle}>
            We Provide Elegant Service{'\n'}for People
          </Text>

          <View style={[styles.featuresRow, { flexDirection: isWide ? 'row' : 'column' }]}>
            {FEATURES.map((f, i) => (
              <View
                key={i}
                style={[
                  styles.featureItem,
                  i !== FEATURES.length - 1 && isWide ? styles.featureDivider : null,
                ]}
              >
                <View style={styles.iconCircle} />
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureBody}>{f.body}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* STORY SECTION 1 */}
        <View style={[styles.storyWrap, { flexDirection: isWide ? 'row' : 'column' }]}>
          <View style={[styles.storyMediaCol, { flex: isWide ? 1 : undefined }]}>
            <Image
              //source={{ uri: 'link goes here' }}
              style={styles.storyImg}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.storyTextCol, { flex: isWide ? 1 : undefined }]}>
            <Text style={styles.storyTitle}>The First Spark</Text>
            <Text style={styles.storyBody}>
              It all started during a gym session when we realized how much joy food brings to
              people. Surrounded by those who want to reach their protein goals, we saw the power of a delicious meal. That’s when the idea
              struck, to build a place where cravings meet their perfect match.  
            </Text>
          </View>
        </View>

        {/* STORY SECTION 2 (mirrored) */}
        <View style={[styles.storyWrap, { flexDirection: isWide ? 'row-reverse' : 'column' }]}>
          <View style={[styles.storyMediaCol, { flex: isWide ? 1 : undefined }]}>
            {/* Faux “arch” look */}
            <Image
              //source={{ uri: 'link goes here' }}
              style={[styles.storyImg, styles.archImg]}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.storyTextCol, { flex: isWide ? 1 : undefined }]}>
            <Text style={styles.storyTitle}>The First Chef</Text>
            <Text style={styles.storyBody}>
              Our journey began with a simple yet bold idea, but it needed a culinary expert to bring it
              to life. Enter our chef, a passionate innovator who shares our vision of crafting dishes
              that tell a story, rooted in reaching your fitness goals with modern flavor.
            </Text>
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

const FEATURES = [
  { title: 'Delicious Food', body: "Our dishes are full of fresh, bold flavors that you'll love and want again." },
  { title: 'Relaxing', body: 'Enjoy your meal in a cozy and welcoming space for every occasion.' },
  { title: 'Friendly Service', body: 'Dedicated to a seamless experience from ordering to taking your last bite.' },
  { title: 'Fresh Ingredients', body: 'We use the best and freshest ingredients in every dish.' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  // Nav
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

  // Panels
  panel: {
    marginTop: 10,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    borderRadius: 18,
  },

  // Intro/Hero
  col: { paddingRight: 16 },
  eyebrow: { color: PEACH, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  h1: {
    color: TEXT,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '800',
    marginBottom: 14,
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  accent: { color: PEACH },
  sub: { color: MUTED, fontSize: 16, lineHeight: 22, marginTop: 6, maxWidth: 720 },
  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  primaryOutline: {
    borderWidth: 1,
    borderColor: PEACH,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryOutlineText: { color: PEACH, fontWeight: '800' },

  // Visual collage
  visualStage: { minHeight: 380, alignItems: 'center', justifyContent: 'center' },
  cardImg: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardImgMain: { width: 460, height: 240 },
  cardImgInset: { width: 320, height: 200, position: 'absolute', bottom: -20, left: 40 },

  // Badge
  badgeWrap: { position: 'absolute', top: -8, right: 40, zIndex: 2 },
  badge: {
    borderWidth: 2,
    borderColor: PEACH,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  badgeBig: { color: PEACH, fontWeight: '900', fontSize: 26 },
  badgeSmall: { color: PEACH, opacity: 0.9, fontSize: 12 },

  // Features
  centerEyebrow: {
    color: PEACH,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  centerTitle: {
    textAlign: 'center',
    color: TEXT,
    fontWeight: '800',
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 18,
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  featuresRow: { gap: 16 },
  featureItem: {
    flex: 1,
    backgroundColor: '#0F1919',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  featureDivider: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
    marginRight: 8,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(231,196,163,0.18)',
    marginBottom: 10,
  },
  featureTitle: { color: TEXT, fontWeight: '800', marginBottom: 6 },
  featureBody: { color: MUTED, textAlign: 'center' },

  // Stories
  storyWrap: {
    marginTop: 18,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 20,
  },
  storyMediaCol: { padding: 10 },
  storyTextCol: { padding: 10, justifyContent: 'center' },
  storyImg: {
    width: '100%',
    height: 300,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  archImg: { borderTopLeftRadius: 60, borderTopRightRadius: 60 },
  storyTitle: {
    color: PEACH,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  storyBody: { color: MUTED, fontSize: 16, lineHeight: 22 },

  // Footer
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