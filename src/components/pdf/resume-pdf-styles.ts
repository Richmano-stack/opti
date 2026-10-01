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
  headline: {
    fontSize: 11,
    marginBottom: 4,
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
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  roleTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    flexGrow: 1,
  },
  roleDates: {
    fontSize: 9,
    color: "#444444",
  },
  company: {
    fontSize: 10,
    color: "#333333",
    marginTop: 1,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  bulletMark: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#111111",
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    flexGrow: 1,
    fontSize: 10,
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
