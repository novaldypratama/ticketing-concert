import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'
import TransactionList from './components/TransactionList'

// ABIs
import TokenMaster from './abis/TokenMaster.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [tokenMaster, setTokenMaster] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const [transactions, setTransactions] = useState([]);

//  const [events, setEvents] = useState([]);

const loadBlockchainData = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(provider);

  const network = await provider.getNetwork();
  const tokenMaster = new ethers.Contract(
    config[network.chainId].TokenMaster.address,
    TokenMaster,
    provider
  );
  setTokenMaster(tokenMaster);

  const totalOccasions = await tokenMaster.totalOccasions();
  const occasions = [];

  for (var i = 1; i <= totalOccasions; i++) {
    const occasion = await tokenMaster.getOccasion(i);
    occasions.push(occasion);
  }

  // Fetch all transactions
  const transactions = await tokenMaster.getTransactions();

  setOccasions(occasions);
  setTransactions(transactions); // Add this line to store transactions

  window.ethereum.on("accountsChanged", async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  });
};


  useEffect(() => {
    loadBlockchainData()
  }, [])



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
            tokenMaster={tokenMaster}
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
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}

    <TransactionList transactions={transactions} />


        
    </div>

    
    
    
  );
}

export default App;