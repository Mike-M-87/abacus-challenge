export function formatCash(cash: String) {
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