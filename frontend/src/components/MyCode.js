import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {Controlled as CodeMirror} from 'react-codemirror2'
require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/theme/dracula.css");

const MyCode = () => {
    // const [Codetext, setCodeText] = useState(
    //     languages.find(x => x.id == 50).template
    //   )
      const [Iptext, setIpText] = useState('')
      const [codetitle, setTitle] = useState('')
      const [Optext, setOpText] = useState('')
      const [codeText, setCodeText] = useState('')
      const [language, setlanguage] = useState(50);
    let {id} = useParams()
    useEffect(() => {
        axios.get(`http://localhost:5000/code/mycode/${id}`).then(response =>{
          console.log(response.data);
        var decodedcode = atob(response.data.codetext);
        setCodeText(decodedcode);
        setlanguage(response.data.languageid);
        setTitle(response.data.codetitle);
    console.log(response.data)})
    }, [])


    //create submission
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
            'Content-Type': 'application/json',
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
            // socket.emit('coding', {
            //   room: Oproom,
            //   newCode: decodedOutput
            // })
      
        }
        else{
          var decodedOutput = response.data.status.description
          setOpText(decodedOutput)
            // socket.emit('coding', {
            //   room: Oproom,
            //   newCode: decodedOutput
            // })
        }
      })
        .catch(function (error) {
          console.log(error);
        });
      }
    //   const handleChange = (e) => {
    //     console.log("language Selected!!");
    //     console.log(e.target.value)
    //     setCodeText(languages.find(x => x.id == e.target.value).template)
    //     setlanguage(e.target.value);
    //   }
      
      
    //   const handleMenu = (event) => {
    //     setAnchorEl(event.currentTarget);
    //   };
      
    //   const handleClose = () => {
    //     setAnchorEl(null);
    //   };
      

    const updateIpText = (value) => {
        setIpText(value);
        // socket.emit('coding', {
        //   room: Iproom,
        //   newCode: value
        // });
      }

    const updateCodeText = (value) => {
        console.log(value)
        setCodeText(value);
    }

    const config = {
        
    }

    const saveCode = (codeText,codetitle, language) => {
      var encodedsourcecode = btoa(codeText);
      console.log(language);
        var mycodes = {
            "codetext": encodedsourcecode,
            "languageid": language,
            "codetitle": codetitle
          };
          // console.log(id)
          var config = {  
              method:'post',
              url:'http://localhost:5000/code',
                data: mycodes,
                headers: {
                    'userid': localStorage.userid,
                    'codeid': id
                }
          }

        axios(config).then(console.log('req sent'))
    }
    return (
        <div>
            {/* <li>{code.codetext}</li> */}
            <CodeMirror
                id="code"
                value={codeText}
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true,
                  indent: true  
                }}
                onBeforeChange={(editor, data, value) => {
                  console.log("value is",value);
                  setCodeText(value)
                }}
                // onChange={(value) => {
                //     updateCodeText(value)
                // }}
              />
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

            <CodeMirror
                id="optext"
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true
                }}
                  value={Optext}
                />
            <button onClick={ () => createsubmisssion(codeText, language, Iptext)}>Run</button>
            <button onClick={ () => saveCode(codeText,codetitle, language)}>save</button>

        </div>
    )
}

export default MyCode
