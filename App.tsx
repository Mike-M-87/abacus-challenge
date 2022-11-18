
import { Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Data, Transaction } from './types/transactions';
import { optionColor, selectColor, styles } from './styles/style';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { TransactionItem } from './components/transactionItem';
import { FetchTransactions } from './network/queries';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState({})
  const [transactionDate, setTransactionDate] = useState<String>("")



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



  useEffect(() => {
    async function GetTransactions() {
      setLoading(true)
      const data: Data = await FetchTransactions()
      FilterTransactions(data.fetchTransactions);
      setLoading(false)
    }
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
                  {searcher(v).map((tx) => (
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
