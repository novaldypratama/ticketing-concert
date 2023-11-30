const TransactionList = ({ transactions }) => {
  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          <p>
            **Occasion:** {transaction.occasionId} 
          </p>
          <p>
            **Seat:** {transaction.seat}
          </p>
          <p>
            **Buyer:** {transaction.buyer}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;