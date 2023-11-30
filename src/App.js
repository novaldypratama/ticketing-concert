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

  //const [transactions, setTransactions] = useState([]);
  const [buyerTransactions, setBuyerTransactions] = useState([]);

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

  // Fetch buyer transactions
  const accountTransactions = account ? await tokenMaster.getTransactionsByBuyer(account) : [];
  setBuyerTransactions(accountTransactions);

  const totalOccasions = await tokenMaster.totalOccasions();
  const occasions = [];

  for (var i = 1; i <= totalOccasions; i++) {
    const occasion = await tokenMaster.getOccasion(i);
    occasions.push(occasion);
  }

  setOccasions(occasions);

  window.ethereum.on("accountsChanged", async (accounts) => {
    if (accounts.length > 0) {
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);

      // Fetch transactions for the connected account
      const transactions = await tokenMaster.getTransactionsByBuyer(account);
      setBuyerTransactions(transactions);
    } else {
      setAccount(null);
      setBuyerTransactions([]);
    }
  });


  // Initial account setup
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

    <TransactionList buyerTransactions={buyerTransactions} />

    </div>

  );
}

export default App;