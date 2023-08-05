import fetch from "node-fetch";
import { useState, useEffect } from "react";

const App = () => {
  const [ value, setValue ] = useState("I want to generate content for (social media platform) Include the following: (text, images, hashtags)")
  const [ message, setMessage ] = useState("")
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessage = async () => {
    const options ={
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:8000/completions", options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

useEffect(() => {
  console.log(currentTitle, value, message)
  if (!currentTitle && value && message) {
    setCurrentTitle(value);
  }
  if(currentTitle && value && message) {
    setPreviousChats(previousChats => (
      [...previousChats, 
        {
        title: currentTitle,
        role: "user",
        content: value
        }, 
        {
        title: currentTitle,
        role: message.role,
        content: message.content
        }
    ]
    ))
  }
}, [message, currentTitle])

console.log(previousChats)

const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
console.log(uniqueTitles)

  return(
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Post</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)} >{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>by Liam Johnson</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ContentGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role" >{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container"> 
            <input placeholder={value} value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessage}>Create!</div>
          </div>
          <p className="info">
            ContentGPT August 2023 version. Free research preview.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App;