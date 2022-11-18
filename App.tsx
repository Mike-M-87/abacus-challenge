
import { Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request, gql } from 'graphql-request'
import { MaterialIcons } from '@expo/vector-icons';
import { Data, Transaction } from './types/transactions';
import { formatCash } from './constants';
import { greyText, iconbg, optionColor, selectColor, styles } from './styles/style';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';


const TransactionItem = ({ tx }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionIcon}><MaterialIcons name="payment" size={30} color="black" /></View>
    <View style={{ marginStart: 10, flexDirection: "column" }}>
      <Text>{tx.Name}</Text>
      <Text style={{ color: greyText }}>{tx.Status}</Text>
    </View>
    <Text style={{ marginStart: "auto", fontWeight: "500" }}>{tx.Type == "CREDIT" ? "-" : "+"}${formatCash(tx.Amount)}</Text>
  </View>
)


export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState({})
  const [transactionDate, setTransactionDate] = useState<String>("")

  const query = gql`
  {
    fetchTransactions{
      ID
      Name
      Type
      Status
      Date
      Amount
    }
  }`

  function searcher(arr: Transaction[]) {
    if (searchTerm == "") {
      return arr
    }
    return arr.filter((tx) => Object.keys(tx).some((k) => tx[k].toString().toLowerCase().includes(searchTerm.toLowerCase())))
  }

  function FilterTransactions(data: Transaction[]) {
    let filteredTransactions = {}
    data.forEach((tx) => {
      let date = new Date(tx.Date).toDateString()
      if (filteredTransactions[date]) {
        filteredTransactions[date].push(tx)
      } else {
        filteredTransactions[date] = Array(tx)
      }
    })
    setTransactions(filteredTransactions)
  }

  async function GetTransactions() {
    try {
      setLoading(true)
      let data: Data = await request('https://challenge-api.onrender.com/query', query)
      FilterTransactions(data.fetchTransactions)
    } catch (error) {
      const errormsg = error.response?.errors[0].message
      alert(errormsg || "Network Error");
    }
    setLoading(false)
  }

  useEffect(() => {
    GetTransactions()
  }, [])


  return (
    <SafeAreaView style={{ marginTop: 10 }}>
      {Platform.OS == "ios" ? <ExpoStatusBar /> : <StatusBar />}

      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        placeholder="Search"
        onChangeText={(value) => {
          setSearchTerm(value)
          setTransactionDate("")
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 10 }}>

        {loading || !transactions ? <ActivityIndicator size="large" style={{ marginTop: "80%" }} /> :
          <>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.filterContainer}>
              {Object.entries(transactions).map(([k, _]: [string, any]) => (
                <TouchableOpacity onPress={() => transactionDate == k ? setTransactionDate("") : setTransactionDate(k)}
                  key={k}
                  style={[styles.filterOption, { backgroundColor: transactionDate == k ? selectColor : optionColor }]}>
                  <Text style={{ color: transactionDate == k ? "rgb(230,230,230)" : "grey", fontWeight: "400" }}>{k}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {Object.entries(transactions).map(([k, v]: [string, Transaction[]]) => (
              transactionDate != "" ?
                transactionDate == k &&
                <View key={k} >
                  {searchTerm == "" && <Text style={styles.transactionHeader}>{k}</Text>}
                  {searcher(v).map((tx, index) => (
                    <TransactionItem key={tx.ID} tx={tx} />
                  ))}
                </View>

                :

                <View key={k}>
                  {searchTerm == "" && <Text style={styles.transactionHeader}>{k}</Text>}
                  {searcher(v).map((tx) => (
                    <TransactionItem key={tx.ID} tx={tx} />
                  ))}
                </View>

            ))}
          </>
        }
      </ScrollView>
    </SafeAreaView >
  );
}
