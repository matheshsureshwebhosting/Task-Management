import axios from "axios"
import Cookies from "js-cookie"

const checkAdmin = async () => {
    const admin = new Promise(async (resolve, reject) => {
        // const token = Cookies.get("_uid")
        const token = localStorage.getItem("clientid")
        if (token !== undefined) {
            const checkAdmin = await axios.get(`/users?filter=%7B%0A%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22clientid%22%3A%22${token}%22%0A%20%20%7D%0A%7D`).then((res) => {
                return res.data
            }).catch((error) => {
                if (error) return false
            })            
            if (checkAdmin === false) return resolve(false)
            if (checkAdmin.length === 0) return resolve(false)
            if(checkAdmin[0].isadmin===true) return resolve(true)
            return resolve(false)
        }

    })
    return await admin
}

export default checkAdmin