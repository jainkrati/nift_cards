import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
  <input type="submit" value="Submit" />
</form>
      </header>
    </div>
  );
}

export default App;
