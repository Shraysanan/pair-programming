import React, {useEffect, useState} from 'react'
import io from 'socket.io-client';
const socket = io('localhost:5000');



const TextEditor = () => {

    const [codeRoom, setcodeRoom] = useState("Code room")
    const [Oproom, setOproom] = useState("output room")
    const [Iproom, setIproom] = useState("input room")

    const [Codetext, setCodeText] = useState('start coding')
    const [Iptext, setIpText] = useState('start coding')
    const [Optext, setOpText] = useState('start coding')

    useEffect(()=>{
        socket.emit('room', { room: codeRoom});
        socket.emit('room', { room: Oproom});
        socket.emit('room', { room: Iproom });

        socket.on('code sent from server', payload => {
          updateCodeFromSockets(payload);
        });
    })

    const updateCodeFromSockets = (payload) =>{
      console.log('inside',payload);
      switch(payload.room){
        case codeRoom: 
          console.log(payload.newCode)
          setCodeText(payload.newCode)
        break;
        case Oproom: 
          console.log(payload.newCode)
          setOpText(payload.newCode)
        break;
        case Iproom: 
          console.log(payload.newCode)
          setIpText(payload.newCode)
        break;
      }
    }

    const updateCodeText = (e) => {
        console.log(e.target.value)
        setCodeText(e.target.value);
        socket.emit('coding', {
          room: codeRoom,
          newCode: e.target.value
        });
        // socket.emit('coding', {
        //   room: "room example",
        //   Code: e.target.value,
        //   output: 
        // });
      }

      // const updateOpText = (e) => {
      //   console.log(e.target.value)
      //   setOpText(e.target.value);
      //   socket.emit('coding', {
      //     room: Oproom,
      //     newCode: e.target.value
      //   });
      //   // socket.emit('coding', {
      //   //   room: "room example",
      //   //   Code: e.target.value,
      //   //   output: 
      //   // });
      // }

      const updateIpText = (e) => {
        console.log(e.target.value)
        setIpText(e.target.value);
        socket.emit('coding', {
          room: Iproom,
          newCode: e.target.value
        });
        // socket.emit('coding', {
        //   room: "room example",
        //   Code: e.target.value,
        //   output: 
        // });
      }

    return (
        <div>

            <h1>hello</h1>
            {/* <textarea value={this.state.value} onChange={this.handleChange} /> */}
            <div>
              <textarea rows="10" cols="100"
              onChange={e => updateCodeText(e)}
              value={Codetext}
              />
            </div>

            <textarea rows="10" cols="100"
            onChange={e => updateIpText(e)}
            value={Iptext}
             />
            {/* <textarea rows="10" cols="100"
            onChange={e => updateOpText(e)}
            value={Optext}
             /> */}
             <div className="output-box">
              <h4>sample output</h4>
             </div>
             
        </div>
    )
}

export default TextEditor
