import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'
import TransactionList from './components/TransactionList'

// ABIs
//import ticketConcert from './abis/ticketConcert.json'

import ConcertTicket from './abis/ConcertTicket.json'
// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [ticketConcert, setticketConcert] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const [transactions, setTransactions] = useState([]);
  const [buyerTransactions, setBuyerTransactions] = useState([]);

//  const [occasions, setOccasions] = useState([]);

 useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();
      const ticketConcert = new ethers.Contract(
        config[network.chainId].ConcertTicket.address,
        ConcertTicket,
        provider
      );

      setticketConcert(ticketConcert);

      const totalOccasions = await ticketConcert.totalOccasions();
      const occasions = [];

      for (var i = 1; i <= totalOccasions; i++) {
        const occasion = await ticketConcert.getOccasion(i);
        occasions.push(occasion);
      }

      const transactions = await ticketConcert.getTransactions();
      const accountTransactions = account ? await ticketConcert.getBuyerTransactions(account) : [];

      setBuyerTransactions(accountTransactions);
      setOccasions(occasions);
      setTransactions(transactions);

      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);

          const transactions = await ticketConcert.getBuyerTransactions(account);
          setBuyerTransactions(transactions);
        } else {
          setAccount(null);
          setBuyerTransactions([]);
        }
      });

      // Subscribe to the NewTransaction occasion
      ticketConcert.on('NewTransaction', async (occasionId, buyer, seat) => {
        if (ethers.utils.getAddress(buyer) === account) {
          const updatedBuyerTransactions = await ticketConcert.getBuyerTransactions(account);
          setBuyerTransactions(updatedBuyerTransactions);
        }
      });
    };

    loadBlockchainData();
  }, [account, ticketConcert]);



  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />

        <h2 className="header__title"><strong>Concert</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            ticketConcert={ticketConcert}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          ticketConcert={ticketConcert}
          provider={provider}
          setToggle={setToggle}
        />
      )}

      <div className='buyer_ticket_container'>
        <TransactionList transactions={transactions} buyerTransactions={buyerTransactions} />  
      </div>
           
    </div>

    
    
    
  );
}

export default App;