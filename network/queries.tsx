import request, { gql } from "graphql-request";

export async function FetchTransactions(){
  const query = gql`
    {
      fetchTransactions {
        ID
        Name
        Type
        Status
        Date
        Amount
      }
    }
  `;
  try {
    let data = await request("https://challenge-api.onrender.com/query", query);
    return data;
  } catch (error) {
    const errormsg = error.response?.errors[0].message;
    alert(errormsg || "Network Error");
    return null;
  }
}
