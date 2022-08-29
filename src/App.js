import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="App-title">Gift a voucher using NIFT cards</div>
      <p></p>
      <form>
  <label>
    Receiver's Ethereum Address:
    <input type="text" name="name" />
  </label>
  <p></p>
  <label>
    Gift Token Amount (in wei):
    <input type="text" name="name" />
  </label>
  <p></p>
  <label>
    Message:
    <input type="text" name="name" />
  </label>
  <p></p>
  <input className="submit" type="submit" value="Submit" />
</form>
      </header>
    </div>
  );
}

export default App;
