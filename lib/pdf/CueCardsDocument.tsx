import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface CueCardsDocumentProps {
  sections: Section[];
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#9f1239",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  content: {
    fontSize: 22,
    lineHeight: 1.6,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 36,
    fontSize: 10,
    color: "#999999",
  },
});

export function CueCardsDocument({ sections }: CueCardsDocumentProps) {
  return (
    <Document>
      {sections.map((section, index) => (
        <Page key={section.id} size="A5" style={styles.page}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.content}>{section.content}</Text>
          <Text style={styles.pageNumber}>
            {index + 1} / {sections.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}
