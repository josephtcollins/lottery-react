import { useEffect, useState } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';


async function onSubmit(event, value, setMessage) {
  event.preventDefault();
  
  const accounts = await web3.eth.getAccounts();

  setMessage('Waiting on transition success...');
  
  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(value, 'ether')
  });

  setMessage('You have been entered!')
}

async function onClick(event, setMessage) {
  const accounts = await web3.eth.getAccounts();

  setMessage('Waiting on transition success...');

  await lottery.methods.pickWinner().send({
    from: accounts[0]
  })  ;

  setMessage('A winner has been picked!')
}

function App() {
  const [manager, setManager] = useState('');
  const [lastWinner, setLastWinner] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      // don't need to specify account in call bc we're using metamask
      const managerAddress = await lottery.methods.manager().call();
      const playersArr = await lottery.methods.getPlayers().call();
      const balanceNum = await web3.eth.getBalance(lottery.options.address);
      const lastWinnerAdd = await lottery.methods.lastWinner().call();
      setManager(managerAddress); setPlayers(playersArr); 
      setBalance(balanceNum); setLastWinner(lastWinnerAdd);
    }
    fetchData();
  })
  
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>There are currently {players.length} completing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <hr />
      <form onSubmit={event => onSubmit(event, value, setMessage)}>
        <h4>Try your luck.</h4>
        <div>
          <label>Amount of ether to enter </label>
          <input 
            value={value} 
            onChange={event => setValue(event.target.value)} 
          />
          <button>Enter</button>
        </div>
      </form>
      <hr />
      <h4>Ready to pick a winner??</h4>
      <button onClick={event => onClick(event, setMessage)}>Pick a winner</button>
      <div>The last winner is {lastWinner}</div>
      <hr />
      <h1>{message}</h1>
      
    </div>
  );
}

export default App;
