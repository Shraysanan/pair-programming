import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Profile = () => {

    const [mycode, setmycode] = useState([]);

    const config = {
        headers:{
            'userId':localStorage.userid
        }
    }

    const response = axios.get("http://localhost:5000/code/mycodes", config).then(response => setmycode(response.data))
    return (
        <div>
            {mycode.map((code) => {
       return(
           <li>{code.codetext}</li>

       )
   })}
        </div>
    )
}

export default Profile
