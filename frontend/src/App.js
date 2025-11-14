import { useState, useEffect, useRef } from "react";


const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const feedRef = useRef(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("")
    setCurrentTitle(null)
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
  };

  const getMessages = async () => {
    if (!value || value.trim() === "") return;

    const currentMessage = value; // Store the current value
    setUserMessage(currentMessage); // Save user's message
    setValue(""); // Clear input immediately

    const options = {
      method: "POST",
      body : JSON.stringify({
        message: currentMessage
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (errors) {
      console.error(errors);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getMessages();
    }
  }

  useEffect(()=>{
    if(!message || !userMessage) return;

    console.log(currentTitle, userMessage, message);

    if(!currentTitle && userMessage && message) {
      setCurrentTitle(userMessage)
    }
    if(currentTitle && userMessage && message) {
      setPrevChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: userMessage
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle, userMessage])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [prevChats])

  console.log(prevChats);

  const currentChat = prevChats.filter(prevChat => prevChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(prevChats.map(previousChat => previousChat.title)))
  


  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={()=> handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Julius</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>JuliusGPT</h1>}
        <ul className="feed" ref={feedRef}>
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GBT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
