import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFrd, setShowAddFrd] = useState(false);
  const [selectedFrd, setSelectedFrd] = useState(null);

  function handleSelection(friend) {
    setSelectedFrd(() => (selectedFrd?.id === friend.id ? null : friend));
    setShowAddFrd(false);
  }

  function handleAddFriend(newFrd) {
    setFriends((friends) => [...friends, newFrd]);
    setShowAddFrd(false);
  }

  function handleSplitBill(bal) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFrd.id
          ? { ...friend, balance: friend.balance + bal }
          : friend
      )
    );
    setSelectedFrd(null);
  }

  return (
    <div className="container">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFrd={selectedFrd}
          handleSelection={handleSelection}
        />
        {showAddFrd && <AddFriend handleAddFriend={handleAddFriend} />}
        <Button onClick={() => setShowAddFrd((show) => !show)}>
          {showAddFrd ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFrd && (
        <SplitBill
          selectedFrd={selectedFrd}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFrd, handleSelection }) {
  return (
    <ul className="friends__list">
      {friends.map((friend) => (
        <FriendItem
          friend={friend}
          key={friend.id}
          selectedFrd={selectedFrd}
          handleSelection={handleSelection}
        />
      ))}
    </ul>
  );
}

function FriendItem({ friend, selectedFrd, handleSelection }) {
  const curFrd = friend.id === selectedFrd?.id;

  return (
    <li className="friend__item">
      <img className="friend__img" src={friend.image} alt={friend.name} />
      <div className="friend__det">
        <h3 className="friend__name">{friend.name}</h3>
        <p className="friend__balance">
          {friend.balance === 0 && `You and ${friend.name} are even`}
          {friend.balance < 0 &&
            `You owe ${friend.name} ${Math.abs(friend.balance)}€ `}
          {friend.balance > 0 &&
            `${friend.name} owes you ${Math.abs(friend.balance)}€ `}
        </p>
      </div>
      <Button onClick={() => handleSelection(friend)}>
        {curFrd ? "close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFrd = { id, name, image: `${image}?=${id}`, balance: 0 };

    handleAddFriend(newFrd);
  }

  return (
    <form className="add-new-friend">
      <label htmlFor="name">Friend Name</label>
      <input
        type="text"
        name="friend-name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="img">Image URL</label>
      <input
        type="text"
        name="friend-img"
        id="img"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button onClick={handleSubmit}>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFrd, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExp, setUserExp] = useState("");
  const friendExp = bill? bill - userExp : "";
  const [paidBy, setPaidBy] = useState("you");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExp) return;

    const bal = paidBy === "you" ? friendExp : -userExp;

    handleSplitBill(bal);

    setBill("");
    setUserExp("");
  }

  return (
    <form className="split-bill">
      <h3>Split a bill with {selectedFrd.name}</h3>

      <label htmlFor="bill">Bill Value</label>
      <input
        type="text"
        id="bill"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label htmlFor="userexplbl">Your Expense</label>
      <input
        type="text"
        id="userexplbl"
        value={userExp}
        onChange={(e) => setUserExp(Number(e.target.value))}
      />

      <label htmlFor="friendexp">{selectedFrd.name}'s Expense</label>
      <input type="text" id="friendexp" value={friendExp} disabled />

      <label htmlFor="paidby">Who is paying the bill</label>
      <select
        id="paidby"
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFrd.name}</option>
      </select>

      <Button onClick={handleSubmit}>Split Bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}

export default App;
