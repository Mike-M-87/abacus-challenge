
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