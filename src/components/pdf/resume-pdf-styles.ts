import { StyleSheet } from "@react-pdf/renderer";

export const resumePdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    paddingTop: 48,
    paddingBottom: 58,
    paddingHorizontal: 54,
    color: "#111111",
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    textAlign: "center",
  },
  contactLine: {
    fontSize: 9,
    color: "#444444",
    textAlign: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom: 14,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#555555",
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 10,
    textAlign: "left",
  },
  skillsText: {
    fontSize: 10,
    textAlign: "left",
  },
  experienceEntry: {
    marginBottom: 10,
  },
  jobTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 2,
  },
  jobMeta: {
    fontSize: 9,
    color: "#444444",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 10,
    textIndent: -7,
  },
  educationEntry: {
    marginBottom: 6,
  },
  degree: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 2,
  },
  educationMeta: {
    fontSize: 9,
    color: "#444444",
  },
});
