
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request, gql } from 'graphql-request'
import { MaterialIcons } from '@expo/vector-icons';


export interface Transaction {
  ID: string;
  Name: string;
  Type: string;
  Status: string;
  Date: Date;
  Amount: number;
}

export interface Data {
  fetchTransactions: Transaction[];
}

export interface RootObject {
  data: Data;
}

function TransactionItem({ tx, index }) {
  return (
    <View style={styles.transactionItem}>
      <Text>{index + 1}</Text>
      <MaterialIcons name="payment" size={24} color="black" />
      <Text>{tx.Name}</Text>
      <Text>{tx.Status}</Text>
      <Text>{tx.Type == "CREDIT" ? "-" : "+"}${formatCash(tx.Amount)}</Text>
    </View>
  )
};


function formatCash(cash: String) {
  if (cash) {
    let str = cash.toString();
    let start = str.includes(".") ? str.length - str.indexOf(".") : 0;
    const FT = 3;
    if (str.length < FT || FT <= 0) {
      return str;
    }
    let arr = [...str];
    for (let i = str.length - FT - start; i > 0; i -= FT) {
      arr.splice(i, 0, ",");
    }
    return arr.join("");
  }
  return cash;
}



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
    <SafeAreaView style={{ flex: 1, marginHorizontal: 10, backgroundColor: "white", marginTop: 10 }}>
      <StatusBar />

      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        placeholder="Search"
        onChangeText={(value) => setSearchTerm(value)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {loading || !transactions ? <ActivityIndicator /> :
          <>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.filterContainer}>
              {Object.entries(transactions).map(([k, _]: [string, any]) => (
                <TouchableOpacity onPress={() =>
                  transactionDate == k ? setTransactionDate("") : setTransactionDate(k)
                }
                  key={k} style={[styles.filterOption, { backgroundColor: transactionDate == k ? "blue" : "skyblue" }]}>
                  <Text>{k}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {Object.entries(transactions).map(([k, v]: [string, Transaction[]]) => (
              transactionDate != "" ?
                transactionDate == k &&

                <View key={k}>
                  <View>
                    <Text style={styles.transactionHeader}>{k}</Text>
                  </View>
                  {searcher(v).map((tx, index) => (
                    <TransactionItem index={index} key={tx.ID} tx={tx} />
                  ))}
                </View>

                :

                <View key={k}>
                  <View>
                    <Text style={styles.transactionHeader}>{k}</Text>
                  </View>
                  {searcher(v).map((tx, index) => (
                    <TransactionItem index={index} key={tx.ID} tx={tx} />
                  ))}
                </View>

            ))}
          </>
        }
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: "black",
    padding: 15,
  },
  filterOption: {
    backgroundColor: "skyblue",
    borderRadius: 10,
    padding: 10,
    marginRight: 10
  },
  filterContainer: {
    marginVertical: 10
  },
  transactionHeader: {

  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 20,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
});
