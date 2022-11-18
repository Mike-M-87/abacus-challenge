
import { Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Data, Transaction } from './types/transactions';
import { optionColor, selectColor, styles } from './styles/style';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { TransactionItem } from './components/transactionItem';
import { FetchTransactions } from './network/queries';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState({})
  const [transactionDate, setTransactionDate] = useState<String>("")


  //filterBySearchTerm returns a list of trasactions that match the supplied search term
  function filterBySearchTerm(searchTerm: string, transactionsArray: Transaction[]) {
    if (searchTerm == "") {
      return transactionsArray
    }
    transactionsArray.filter((tx) => Object.keys(tx).some((k) => tx[k].toString().toLowerCase().includes(searchTerm.toLowerCase())))
  }

  function FilterTransactionsFromData(data: Transaction[]) {
    let filteredTransactions = {}
    if (data) {
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
  }

  useEffect(() => {
    async function GetTransactions() {
      setLoading(true)
      const data: Data = await FetchTransactions()
      FilterTransactionsFromData(data.fetchTransactions);
      setLoading(false)
    }

    GetTransactions()
  }, [])


  return (
    <SafeAreaView style={{ marginTop: 10 }}>
      {Platform.OS == "ios" ? <ExpoStatusBar /> : <StatusBar />}

      <View style={styles.searchInput}>
        <MaterialIcons name="search" size={20} color="grey" />

        <TextInput
          style={{ flexGrow: 1, marginStart: 10 }}
          value={searchTerm}
          placeholder="Search by name or type"
          onChangeText={(value) => {
            setSearchTerm(value)
            setTransactionDate("")
          }}
        />

        <TouchableOpacity style={{ marginStart: "auto" }} onPress={() => setSearchTerm("")}>
          <MaterialIcons name="clear" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 10 }}>

        {loading ? <ActivityIndicator size="large" style={{ marginTop: "80%" }} /> :

          !transactions ?
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: "80%" }}>
              <Text style={{ fontSize: 18 }}>Transactions Not Found</Text>
            </View>
            :
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



              {Object.entries(transactions).map(([formatedDate, v]: [string, Transaction[]]) => (
                transactionDate != "" ?
                  transactionDate == formatedDate &&

                  <View key={formatedDate} >
                    {searchTerm == "" && <Text style={styles.transactionHeader}>{formatedDate}</Text>}
                    {filterBySearchTerm(searchTerm, v).map((tx) => (
                      <TransactionItem key={tx.ID} tx={tx} />
                    ))
                    }
                  </View>
                  :
                  <View key={formatedDate} >
                    {searchTerm == "" && <Text style={styles.transactionHeader}>{formatedDate}</Text>}
                    {filterBySearchTerm(searchTerm, v).map((tx) => (
                      <TransactionItem key={tx.ID} tx={tx} />
                    ))
                    }
                  </View>

              ))}
            </>
        }
      </ScrollView>
    </SafeAreaView >
  );
}
