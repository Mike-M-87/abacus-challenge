import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request, gql } from 'graphql-request'



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




const DATA = [
  {
    "ID": "29dee332-d856-4930-a23d-940f5227d772",
    "Name": "Destini",
    "Type": "CREDIT",
    "Status": "PENDING",
    "Date": "2022-11-20T15:39:54.009352+03:00",
    "Amount": 388520
  },
  {
    "ID": "98ff7c70-01cd-4b6f-bcd2-53afa621f8bf",
    "Name": "Adelle",
    "Type": "DEBIT",
    "Status": "PENDING",
    "Date": "2022-11-18T15:39:54.009365+03:00",
    "Amount": 391147
  },
  {
    "ID": "3dc1a2de-8697-42bc-9881-424dae06c4f2",
    "Name": "Myrna",
    "Type": "CREDIT",
    "Status": "INITIATED",
    "Date": "2022-11-20T15:39:54.009368+03:00",
    "Amount": 104206
  },
  {
    "ID": "0ac203dc-ad19-4a80-b97d-360dd478b28c",
    "Name": "Rosina",
    "Type": "CREDIT",
    "Status": "COMPLETED",
    "Date": "2022-11-17T15:39:54.009371+03:00",
    "Amount": 542081
  },
  {
    "ID": "b8601cbb-78c2-442a-821a-6c4a9e49d7ec",
    "Name": "Jaunita",
    "Type": "DEBIT",
    "Status": "INITIATED",
    "Date": "2022-11-18T15:39:54.009375+03:00",
    "Amount": 309673
  },
  {
    "ID": "35f702e0-a375-4505-bac8-15a91f7e969f",
    "Name": "Pansy",
    "Type": "DEBIT",
    "Status": "INITIATED",
    "Date": "2022-11-19T15:39:54.009378+03:00",
    "Amount": 903117
  },
  {
    "ID": "5be77adc-f65d-45d1-89f3-af931462e62f",
    "Name": "Bridget",
    "Type": "CREDIT",
    "Status": "PENDING",
    "Date": "2022-11-18T15:39:54.009381+03:00",
    "Amount": 441172
  },
  {
    "ID": "0d338b30-9ad4-4815-adf8-03c363ba7c17",
    "Name": "Izabella",
    "Type": "CREDIT",
    "Status": "PENDING",
    "Date": "2022-11-19T15:39:54.009384+03:00",
    "Amount": 764305
  },
  {
    "ID": "992d7833-7d95-45cf-8fdc-79f48ccc9bbe",
    "Name": "Vernie",
    "Type": "CREDIT",
    "Status": "PENDING",
    "Date": "2022-11-19T15:39:54.009387+03:00",
    "Amount": 890196
  },
  {
    "ID": "5b890904-3041-4811-9d94-31ee26ec16ea",
    "Name": "Nicolette",
    "Type": "CREDIT",
    "Status": "INITIATED",
    "Date": "2022-11-17T15:39:54.00939+03:00",
    "Amount": 637589
  },
  {
    "ID": "d8bcc3a6-0752-4df3-9a66-d8cdf4e715ba",
    "Name": "Orpha",
    "Type": "DEBIT",
    "Status": "COMPLETED",
    "Date": "2022-11-20T15:39:54.009393+03:00",
    "Amount": 184043
  },
  {
    "ID": "4d3304f5-621e-4479-98f4-89ac79afd333",
    "Name": "Treva",
    "Type": "DEBIT",
    "Status": "PENDING",
    "Date": "2022-11-20T15:39:54.009396+03:00",
    "Amount": 993388
  },
  {
    "ID": "462d46cc-9558-4d55-84ee-ae5f0a3aa096",
    "Name": "Bria",
    "Type": "DEBIT",
    "Status": "INITIATED",
    "Date": "2022-11-17T15:39:54.009399+03:00",
    "Amount": 639616
  },
  {
    "ID": "6926a0dd-a6ca-4b3f-b840-f269d74eea0e",
    "Name": "Audra",
    "Type": "DEBIT",
    "Status": "PENDING",
    "Date": "2022-11-19T15:39:54.009403+03:00",
    "Amount": 624445
  },
  {
    "ID": "b9e0fd89-a8e8-4286-b25b-fe8bcaa3b8c5",
    "Name": "Mabelle",
    "Type": "CREDIT",
    "Status": "COMPLETED",
    "Date": "2022-11-17T15:39:54.009406+03:00",
    "Amount": 115966
  },
  {
    "ID": "f0ef0b40-df48-4330-a36b-b78e16c657d0",
    "Name": "Raegan",
    "Type": "CREDIT",
    "Status": "INITIATED",
    "Date": "2022-11-17T15:39:54.009409+03:00",
    "Amount": 367839
  },
  {
    "ID": "db5ef061-0ca1-435b-9e6e-5e0a11e3bdcb",
    "Name": "Marjolaine",
    "Type": "CREDIT",
    "Status": "COMPLETED",
    "Date": "2022-11-18T15:39:54.009413+03:00",
    "Amount": 450215
  },
  {
    "ID": "d55cee07-eafd-4634-9481-d0f20139bb7a",
    "Name": "Etha",
    "Type": "CREDIT",
    "Status": "INITIATED",
    "Date": "2022-11-17T15:39:54.009416+03:00",
    "Amount": 216221
  },
  {
    "ID": "1529b5aa-0d48-4088-a023-58d4a6dec492",
    "Name": "Nina",
    "Type": "DEBIT",
    "Status": "PENDING",
    "Date": "2022-11-17T15:39:54.009419+03:00",
    "Amount": 700664
  },
  {
    "ID": "6214416e-1655-4aea-bf3c-81211bf99ab9",
    "Name": "Georgianna",
    "Type": "CREDIT",
    "Status": "COMPLETED",
    "Date": "2022-11-20T15:39:54.009422+03:00",
    "Amount": 298732
  }
]



const TransactionItem = ({ tx }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
    <Text>{tx.ID}</Text>
    <Text>{tx.Name}</Text>
    <Text>{tx.Type}</Text>
    <Text>{tx.Status}</Text>
    <Text>{tx.Amount}</Text>
  </View>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState({})


  const query = gql`
  {  fetchTransactions{
      ID
      Name
      Type
      Status
      Date
      Amount
    }
  }`






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
      try {
        let data: Data = await request('https://challenge-api.onrender.com/query', query)
        FilterTransactions(data.fetchTransactions)

      } catch (error) {
        console.error(error);

        const errormsg = error.response?.errors[0].message
        alert(errormsg || "Network Error");
      }
    }
    GetTransactions()
  }, [])


  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
      <ScrollView>
        <StatusBar style="auto" />
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          placeholder="Search"
          onChangeText={(value) => setSearchTerm(value)}
        />

        <ScrollView showsVerticalScrollIndicator={false} horizontal style={styles.filterContainer}>
          {Object.entries(transactions).map(([k, _]) => (
            <TouchableOpacity key={k} style={styles.filterOption}>
              <Text>{k}</Text>
            </TouchableOpacity>
          ))}
          {Object.entries(transactions).map(([k, v]) => (
            <View>
              <TouchableOpacity><Text>{k}</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: "black",
    padding: 15,
  },
  filterOption: {
    backgroundColor: "grey",
    padding: 10,
    marginHorizontal: 10
  },
  filterContainer: {
    marginRight: 10
  }
});
