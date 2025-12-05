import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import { Link, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

// Theme constants (kept consistent with existing screens)
const BG = '#0B1313';
const PANEL = '#0E1717';
const PEACH = '#E7C4A3';
const TEXT = 'rgba(255,255,255,0.92)';
const MUTED = 'rgba(255,255,255,0.72)';

interface FaqItem {
  q: string;
  a: string;
  tags?: string[];
}

const FAQS: FaqItem[] = [
  {
    q: 'What payment methods do you accept?',
    a: 'We currently accept major credit and debit cards (Visa, MasterCard, AmEx), Apple Pay, Google Pay, and secure online checkout. For in-person pickup, cash is accepted.',
    tags: ['Payments']
  },
  {
    q: 'What time are orders accepted?',
    a: 'Online orders are accepted daily from 10:00 AM – 9:00 PM (PST). Bulk and next‑day catering requests can be submitted 24/7; we confirm those during normal business hours.',
    tags: ['Hours']
  },
  {
    q: 'Can I place a bulk order?',
    a: 'Yes. For 15+ meals or event trays, please submit details (date, headcount, dietary notes) via the Contact form or email us. We recommend 24–48 hours notice to guarantee availability. You can start a bulk inquiry on our Contact page.',
    tags: ['Bulk']
  },
  {
    q: 'How far in advance should I place a large order?',
    a: 'Standard: 24 hours. Events above 40 servings: 48+ hours. Holiday periods may require earlier booking. We try to accommodate urgent requests—reach out directly.',
    tags: ['Bulk']
  },
  {
    q: 'Do you offer delivery or pickup?',
    a: 'We provide both. Delivery radius is currently ~10 miles from our kitchen. Pickup times are scheduled at checkout to reduce wait. $2 delivery fee within our capabilities!',
    tags: ['Delivery']
  },
  {
    q: 'Can I customize dishes for dietary needs?',
    a: 'Absolutely. Note allergies or macro targets in the “Special Requests” box. We can adjust seasoning levels, swap protein options, and omit common allergens where possible.',
    tags: ['Customization']
  },
  {
    q: 'Is nutrition / macro information available?',
    a: 'Yes. Each high‑protein dish lists approximate calories, protein, carbs, and fats. Detailed micronutrients and ingredient sourcing will roll out with our upcoming Menu Detail update.',
    tags: ['Nutrition']
  },
  {
    q: 'Do you have a rewards or loyalty program?',
    a: 'A points system is planned. For now, follow our social channels for limited bundles, giveaways, and more.',
    tags: ['Rewards']
  },
  {
    q: 'What if I need to change or cancel my order?',
    a: 'Contact us as soon as possible. Small orders can often be adjusted up to 30 minutes before prep. Bulk/catering modifications depend on progress—email or call for fastest response.',
    tags: ['Changes']
  }
];

export default function FaqScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isMobile = width < 600;
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    try { router.replace("/(tabs)"); } catch {}
  };

  const categories = React.useMemo(() => {
    const all = new Set<string>();
    FAQS.forEach(f => f.tags?.forEach(t => all.add(t)));
    return Array.from(all);
  }, []);

  const filtered = React.useMemo(() => {
    const qLower = query.trim().toLowerCase();
    return FAQS.filter(item => {
      const textMatch = !qLower || item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower);
      const catMatch = !category || item.tags?.includes(category);
      return textMatch && catMatch;
    });
  }, [query, category]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER / NAV ROW */}
        <View style={styles.nav}>
          <View style={styles.brandRow}>
            <View style={styles.logoFlame} />
            <Text style={styles.brand}>GAEL'S CRAVES</Text>
          </View>
          <View style={[styles.navRight, isMobile && styles.navRightMobile]}>
            <Link href="/" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  Home
                </Text>
              </Pressable>
            </Link>

            <Link href="/about" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  About
                </Text>
              </Pressable>
            </Link>

            <Link href="/contact" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  Contact us
                </Text>
              </Pressable>
            </Link>

            <Text style={[styles.navLink, styles.navLinkActive, isMobile && styles.navLinkMobile]}>
              FAQ
            </Text>

            {user ? (
              <Pressable
                style={isMobile ? styles.loginBtnMobile : styles.loginBtn}
                onPress={handleLogout}
              >
                <Text style={styles.loginText}>LOGOUT</Text>
              </Pressable>
            ) : (
              <Link href="/login" asChild>
                <Pressable style={isMobile ? styles.loginBtnMobile : styles.loginBtn}>
                  <Text style={styles.loginText}>LOGIN</Text>
                </Pressable>
              </Link>
            )}
          </View>
        </View>

        {/* PANEL INTRO */}
        <View style={[styles.panel, { flexDirection: isWide ? 'row' : 'column' }]}>
          <View style={[styles.col, { flex: isWide ? 1 : undefined }]}>
            <Text style={styles.eyebrow}>Need Answers?</Text>
            <Text style={styles.h1}>Frequently Asked Questions</Text>
            <Text style={styles.sub}>
              Quick guidance for ordering, payments, customization, bulk requests and more.
              Use the search box below to filter topics instantly.
            </Text>
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search questions (e.g. payment, bulk)"
                placeholderTextColor={MUTED}
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <Text style={styles.resultCount}>
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'} {category ? `in ${category}` : ''}
            </Text>

            {/* Category Chips */}
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, !category && styles.chipActive]}
                onPress={() => setCategory(null)}
              >
                <Text style={[styles.chipText, !category && styles.chipTextActive]}>🔥 All</Text>
              </Pressable>
              {categories.map(cat => (
                <Pressable
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat === category ? null : cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {categoryEmoji(cat)} {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* FAQ COLLAPSIBLES */}
        <View style={styles.faqList}>
          {filtered.map((item, idx) => (
            <View key={idx} style={styles.faqItem}>
              <Collapsible title={item.q}>
                <Text style={styles.answer}>{item.a}</Text>
                {item.tags && (
                  <View style={styles.tagWrap}>
                    {item.tags.map(t => (
                      <Text key={t} style={styles.tag}>{categoryEmoji(t)} {t}</Text>
                    ))}
                  </View>
                )}
              </Collapsible>
            </View>
          ))}
          {filtered.length === 0 && (
            <Text style={styles.empty}>No matches. Try a different keyword.</Text>
          )}
          {/* Need More Help CTA */}
          <View style={styles.helpPanel}>
            <Text style={styles.helpTitle}>Need more help?</Text>
            <Text style={styles.helpBody}>Can’t find what you’re looking for? Reach out directly and we’ll respond as fast as possible.</Text>
            <Link href="/contact" asChild>
              <Pressable style={styles.helpBtn}>
                <Text style={styles.helpBtnText}>📨 Contact Us</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>GAEL'S CRAVES</Text>
          <Text style={styles.copy}>© {new Date().getFullYear()} Gael's Craves — All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function categoryEmoji(cat: string): string {
  switch (cat) {
    case 'Payments': return '💳';
    case 'Hours': return '⏰';
    case 'Bulk': return '📦';
    case 'Delivery': return '🚚';
    case 'Customization': return '🍽️';
    case 'Nutrition': return '🧪';
    case 'Rewards': return '🎁';
    case 'Changes': return '🔄';
    default: return '❓';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
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
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navRightMobile: {
    gap: 12,
    flexWrap: 'wrap',
  },
  navLink: {
    color: MUTED,
    fontWeight: '600',
    fontSize: 14,
  },
  navLinkMobile: {
    fontSize: 12,
  },
  navLinkActive: { color: PEACH, fontWeight: '700' },
  loginBtn: {
    backgroundColor: PEACH,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginBtnMobile: {
    backgroundColor: PEACH,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginText: {
    color: '#0B1313',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  panel: {
    marginTop: 8,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    borderRadius: 18,
  },
  col: { paddingRight: 16 },
  eyebrow: { color: PEACH, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  h1: {
    color: TEXT,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    marginBottom: 14,
    fontFamily: 'Georgia, Times New Roman, serif',
  },
  sub: { color: MUTED, fontSize: 16, lineHeight: 22, marginTop: 6, maxWidth: 720 },
  searchWrap: { marginTop: 18 },
  searchInput: {
    backgroundColor: '#0F1919',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 14,
  },
  resultCount: { color: MUTED, marginTop: 8, fontSize: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  chipActive: { backgroundColor: PEACH, borderColor: PEACH },
  chipText: { color: MUTED, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#1b1b1b' },
  faqList: { marginTop: 18, gap: 12 },
  faqItem: {
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 10,
  },
  answer: { color: MUTED, fontSize: 14, lineHeight: 20, marginTop: 4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: {
    backgroundColor: '#0F1919',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    color: MUTED,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)'
  },
  helpPanel: {
    marginTop: 26,
    backgroundColor: '#0F1919',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    gap: 10
  },
  helpTitle: { color: PEACH, fontWeight: '800', fontSize: 18 },
  helpBody: { color: MUTED, fontSize: 14, lineHeight: 20 },
  helpBtn: {
    marginTop: 6,
    backgroundColor: PEACH,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  helpBtnText: { color: '#1b1b1b', fontWeight: '800' },
  empty: { color: MUTED, textAlign: 'center', marginTop: 20 },
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
