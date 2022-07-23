import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "../../constants";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  dropdownButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.actionBg,//"#EFEFEF",
    width: 40,
    height: 40,
    // paddingHorizontal: 8,
    overflow: "hidden",
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    // marginHorizontal: 8,
  },
  dropdownCustomizedButtonParent: {
    flex: 1,
    overflow: "hidden",
  },
  //////////////////////////////////////
  dropdownOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,1)",
  },
  dropdownOverlayView: {
    backgroundColor: "#C4C4C4",
  },
  dropdownActivityIndicatorView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  //////////////////////////////////////
  dropdownRow: {
    flex: 1,
    height: 44,
    width: Platform.OS === 'ios' ? 254 : 130,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#939396",
    borderBottomWidth:  Platform.OS === 'ios' ? 0.5 :0,
    paddingVertical:8
  },
  dropdownRowText: {
    flex: 1,
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    lineHeight: Platform.OS === 'ios' ? 22 : 18.75
  },
  dropdownCustomizedRowParent: {
    flex: 1,
    overflow: "hidden",
  },
  //////////////////////////////////////
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    // elevation: 4,
  },
});

export default styles;
