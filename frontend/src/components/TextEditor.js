import React, {useEffect, useState} from 'react'
import io from 'socket.io-client';
import axios from 'axios';
import './TextEditor.css'
import {Controlled as CodeMirror} from 'react-codemirror2'
require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/theme/dracula.css");

const socket = io('localhost:5000');



const TextEditor = () => {
  const [language, setlanguage] = useState('');
    const  languages=[
        {
          "id": 45,
          "name": "Assembly (NASM 2.14.02)"
        },
        {
          "id": 46,
          "name": "Bash (5.0.0)"
        },
        {
          "id": 47,
          "name": "Basic (FBC 1.07.1)"
        },
        {
          "id": 48,
          "name": "C (GCC 7.4.0)"
        },
        {
          "id": 52,
          "name": "C++ (GCC 7.4.0)"
        },
        {
          "id": 49,
          "name": "C (GCC 8.3.0)"
        },
        {
          "id": 53,
          "name": "C++ (GCC 8.3.0)"
        },
        {
          "id": 50,
          "name": "C (GCC 9.2.0)"
        },
        {
          "id": 54,
          "name": "C++ (GCC 9.2.0)"
        },
        {
          "id": 51,
          "name": "C# (Mono 6.6.0.161)"
        },
        {
          "id": 55,
          "name": "Common Lisp (SBCL 2.0.0)"
        },
        {
          "id": 56,
          "name": "D (DMD 2.089.1)"
        },
        {
          "id": 57,
          "name": "Elixir (1.9.4)"
        },
        {
          "id": 58,
          "name": "Erlang (OTP 22.2)"
        },
        {
          "id": 44,
          "name": "Executable"
        },
        {
          "id": 59,
          "name": "Fortran (GFortran 9.2.0)"
        },
        {
          "id": 60,
          "name": "Go (1.13.5)"
        },
        {
          "id": 61,
          "name": "Haskell (GHC 8.8.1)"
        },
        {
          "id": 62,
          "name": "Java (OpenJDK 13.0.1)"
        },
        {
          "id": 63,
          "name": "JavaScript (Node.js 12.14.0)"
        },
        {
          "id": 64,
          "name": "Lua (5.3.5)"
        },
        {
          "id": 65,
          "name": "OCaml (4.09.0)"
        },
        {
          "id": 66,
          "name": "Octave (5.1.0)"
        },
        {
          "id": 67,
          "name": "Pascal (FPC 3.0.4)"
        },
        {
          "id": 68,
          "name": "PHP (7.4.1)"
        },
        {
          "id": 43,
          "name": "Plain Text"
        },
        {
          "id": 69,
          "name": "Prolog (GNU Prolog 1.4.5)"
        },
        {
          "id": 70,
          "name": "Python (2.7.17)"
        },
        {
          "id": 71,
          "name": "Python (3.8.1)"
        },
        {
          "id": 72,
          "name": "Ruby (2.7.0)"
        },
        {
          "id": 73,
          "name": "Rust (1.40.0)"
        },
        {
          "id": 74,
          "name": "TypeScript (3.7.4)"
        }
      ];

     


    const [codeRoom, setcodeRoom] = useState("Code room")
    const [Oproom, setOproom] = useState("output room")
    const [Iproom, setIproom] = useState("input room")

    const [Codetext, setCodeText] = useState('')
    const [Iptext, setIpText] = useState('')
    const [Optext, setOpText] = useState('')

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

    const updateCodeText = (value) => {
        console.log(value)
        setCodeText(value);
        socket.emit('coding', {
          room: codeRoom,
          newCode: value
        });
        // socket.emit('coding', {
        //   room: "room example",
        //   Code: e.target.value,
        //   output: 
        // });
      }

   

      const updateIpText = (value) => {
        setIpText(value);
        socket.emit('coding', {
          room: Iproom,
          newCode: value
        });
      }

      
const createsubmisssion = (source_code,languageid,stdin) => {
  var encodedsourcecode = btoa(source_code);
  var encodedstdin = btoa(stdin);
  var data = JSON.stringify({
    "source_code": encodedsourcecode,
    "language_id": languageid,
    "stdin": encodedstdin
  });
  
  var config = {
    method: 'post',
    url: 'https://ce.judge0.com/submissions/?base64_encoded=true&wait=true',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data)); 
    localStorage.setItem('token',response.data.token)
    getsubmission(response.data.token);
  })
  .catch(function (error) {
    console.log(error);
  });
}



const getsubmission = (token) => {
  // let mytoken=localStorage.getItem('token')
  
  var config = {
    method: 'get',
    url: `https://ce.judge0.com/submissions/${token}?base64_encoded=true`,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    if(response.data.status.description == 'Accepted'){
      if(response.data.stdout){
        var decodedOutput = atob(response.data.stdout);
      }
      else if(response.data.stderr){
        var decodedOutput=atob(response.data.stderr);
      }
      else if(response.data.compile_output){
        var decodedOutput=atob(response.data.compile_output);
      }
      setOpText(decodedOutput)
      socket.emit('coding', {
        room: Oproom,
        newCode: decodedOutput
      })

  }
  else{
    var decodedOutput = response.data.status.description
    setOpText(decodedOutput)
      socket.emit('coding', {
        room: Oproom,
        newCode: decodedOutput
      })
  }
})
  .catch(function (error) {
    console.log(error);
  });
}
const handleChange = (e) => {
  console.log("Fruit Selected!!");
  setlanguage(e.target.value);
}




    return (
      
        <div>
           <h1>hello</h1>
          <select value={language} onChange={(e)=>handleChange(e)}>
              {languages.map((option) => (
                  <option value={option.id}>{option.name}</option>
              ))}
          </select>
           <div className="coding row no-gutters">
            <div className="code col-6">
              <CodeMirror
                id="code"
                value={Codetext}
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true,
                  indent: true  
                }}
                onBeforeChange={(editor, data, value) => {
                  console.log("value is",value);
                  updateCodeText(value)
                }}

              />
            </div>
            <div className="col-6">
              <div className="row">
                <div className="iptext col-12">
                <CodeMirror
                  id="iptext"
                  value={Iptext}
                  options={{
                    mode: 'javascript',
                    theme: 'dracula',
                    lineNumbers: true
                  }}
                  onBeforeChange={(editor, data, value) => {
                    updateIpText(value)
                  }}
                />
                </div>
                <div className="optext col-12">
                <CodeMirror
                id="optext"
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true
                }}
                  value={Optext}
                />
                </div>
              </div>
            </div>
           </div>

             <button onClick={ () => createsubmisssion(Codetext, language, Iptext)}>Run</button>
        </div>
    )
}


export default TextEditor
