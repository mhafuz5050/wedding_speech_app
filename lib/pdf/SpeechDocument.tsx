import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface SpeechDocumentProps {
  title: string;
  subtitle: string;
  sections: Section[];
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#666666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#9f1239",
  },
  paragraph: {
    fontSize: 12,
  },
});

export function SpeechDocument({ title, subtitle, sections }: SpeechDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.paragraph}>{section.content}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
