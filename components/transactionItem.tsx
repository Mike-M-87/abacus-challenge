import { Text, View } from "react-native";
import { greyText, styles } from "../styles/style";
import { MaterialIcons } from '@expo/vector-icons';
import { formatCash } from "../constants";


export const TransactionItem = ({ tx }) => (
    <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}><MaterialIcons name="payment" size={30} color="black" /></View>
        <View style={{ marginStart: 10, flexDirection: "column" }}>
            <Text>{tx.Name}</Text>
            <Text style={{ color: greyText }}>{tx.Status}</Text>
        </View>
        <Text style={{ marginStart: "auto", fontWeight: "500" }}>{tx.Type == "CREDIT" ? "-" : "+"}${formatCash(tx.Amount)}</Text>
    </View>
)