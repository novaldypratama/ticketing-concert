const TransactionList = ({ transactions, buyerTransactions }) => {
  //console.log(transactions);
  //console.log(buyerTransactions);

  // Return your JSX here
  return (
    <div className="transaction">
      <div className="transaction-list">
       
      {/* <p>All Transactions:</p>
      <pre>{JSON.stringify(transactions, null, 2)}</pre> */}

      {/* <p>Your Transactions:</p> */}
      {buyerTransactions.length > 0 ? (
        <ul className="ticket-list">
          <h3> Your Ticket</h3>
          {buyerTransactions.map((transaction) => (
            <li key={transaction.id} className="ticket">
              <p>
                <strong>Occasion:</strong> {transaction.occasionId.toString()} 
              </p>
              <p>
                <strong>Seat:</strong> {transaction.seat.toString()}
              </p>
              <p>
                <strong>Buyer:</strong> {transaction.buyer}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found for this buyer.</p>
      )}
    </div>

    </div>
    
  );
  // return (
  //   <div>
  //     <p>Transactions:</p>
  //     <pre>{JSON.stringify(transactions, null, 2)}</pre>

  //     <p>Buyer Transactions:</p>
  //     <pre>{JSON.stringify(buyerTransactions, null, 2)}</pre>

  //     {/* Add your list rendering logic here if needed */}
  //      <ul>
  //       {transactions.map((transaction) => (
  //         <li key={transaction.id}>
  //           <p>
  //             <strong>Occasion:</strong> {transaction.occasionId.toString()} 
  //           </p>
  //           <p>
  //             <strong>Seat:</strong> {transaction.seat.toString()}
  //           </p>
  //           <p>
  //             <strong>Buyer:</strong> {transaction.buyer}
  //           </p>
  //         </li>
  //       ))}
  //     </ul> 
  //   </div>
  // );
};

export default TransactionList;
