// Registration constants
import {appUrl} from '../../../helpers.js';

const BUTTON = document.getElementById("submit-button");
const EMAIL = document.getElementById("email");
const FIRSTNAME = document.getElementById("firstname");
const SURNAME = document.getElementById("surname");
const REGNO = document.getElementById("regnumber");
const PROGRAM = document.getElementById("program");
const YEAR = document.getElementById("year");
const PAYMENT = document.getElementById("payment-proof");
const PASSWORD = document.getElementById("password");
const CONFIRM_PASSWORD = document.getElementById("confirm-password");


const handleRegister = async(e)=>{
    e.preventDefault();
    const confirmValue = CONFIRM_PASSWORD?.value;
    const passwordValue = PASSWORD?.value;
    
    if(confirmValue !== passwordValue){
        throw new Error("Password does not match");
        
    }else{
        try {
            const form = new FormData();
            form.append("firstname", FIRSTNAME?.value);
            form.append("surname", SURNAME?.value);
            form.append("email", EMAIL?.value);
            form.append("regNumber", REGNO?.value);
            form.append("programId", PROGRAM?.value);
            form.append("year", YEAR?.value);
            form.append("file", PAYMENT?.files[0]);
            form.append("password", PASSWORD?.value);
            const response = await fetch(`${appUrl}auth/register`, {
                method:"POST",
                body:JSON.stringify(form)
            });

            const result = response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        
    }
}

BUTTON.addEventListener('submit', handleRegister)