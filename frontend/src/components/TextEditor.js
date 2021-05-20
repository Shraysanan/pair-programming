import React, {useEffect, useState} from 'react'
import io from 'socket.io-client';
const socket = io('localhost:5000');



const TextEditor = () => {

    // constructor(){
        
    // }
    
    const [room, setroom] = useState("room1")
    const [text, setText] = useState('start coding')
    useEffect(()=>{
        console.log('inside useffect');
        socket.emit('room', { room: "room example" });
    })

    const updateCodeinState = (e) => {
        console.log(e.target.value)
        setText(e.target.value);
        socket.emit('coding', {
          room: "room example",
          newCode: e.target.value
        });
      }

    return (
        <div>
            <h1>hello</h1>
            <input type="text"
             onChange={e => updateCodeinState(e)}
            value={text}
             />
        </div>
    )
}

export default TextEditor
