import { StyleSheet } from "@react-pdf/renderer";

export const resumePdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    paddingTop: 46,
    paddingBottom: 52,
    paddingHorizontal: 52,
    color: "#1c1c1c",
  },
  header: {
    alignItems: "center",
    marginBottom: 14,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    color: "#3a3a3a",
    textAlign: "center",
    marginBottom: 3,
  },
  contactLine: {
    fontSize: 9,
    color: "#5f5f5f",
    textAlign: "center",
  },
  section: {
    marginBottom: 12,
  },
  sectionHeading: {
    borderBottomWidth: 0.75,
    borderBottomColor: "#1c1c1c",
    marginBottom: 6,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: "#1c1c1c",
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.45,
  },
  skillsText: {
    fontSize: 10,
    lineHeight: 1.45,
  },
  experienceEntry: {
    marginBottom: 8,
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
    color: "#5f5f5f",
  },
  company: {
    fontSize: 10,
    color: "#5f5f5f",
    marginTop: 1,
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bulletMark: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#1c1c1c",
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  educationEntry: {
    marginBottom: 6,
  },
  degree: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    flexGrow: 1,
  },
  educationMeta: {
    fontSize: 9,
    color: "#5f5f5f",
    marginTop: 1,
  },
});
