import { StyleSheet } from "react-native";

export const selectColor = "rgb(0,62,254)"
export const optionColor = "rgb(243,245,247)"
export const iconbg = "rgb(249,251,252)"
export const greyText = "rgb(160,161,168)"

export const styles = StyleSheet.create({
    searchInput: {
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 15,
        backgroundColor: optionColor,
    },
    filterOption: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    filterContainer: {
        marginVertical: 10
    },
    transactionHeader: {
        marginVertical: 10,
        fontWeight: "500"
    },
    transactionItem: {
        borderWidth: 1,
        borderColor: "rgb(230,230,230)",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
    transactionIcon: { backgroundColor: iconbg, borderRadius: 10, padding: 10 }
});
