// TransactionList.js
const TransactionList = ({ buyerTransactions }) => {
  return (
    <ul>
      {buyerTransactions.map((transaction, index) => (
        <li key={index}>
          <p>
            <strong>Occasion:</strong> {transaction.occasionId} 
          </p>
          <p>
            <strong>Seat:</strong> {transaction.seat}
          </p>
          <p>
            <strong>Buyer:</strong> {transaction.buyer}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;