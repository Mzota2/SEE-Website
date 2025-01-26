// Registration constants
import {appUrl} from '../../../helpers.js';

const FORM = document.getElementById("submit-form");
const EMAIL = document.getElementById("email-address");
const FIRSTNAME = document.getElementById("firstname");
const SURNAME = document.getElementById("surname");
const REGNO = document.getElementById("regnumber");
const PROGRAM = document.getElementById("programs");
const YEAR = document.getElementById("year");
const PAYMENT = document.getElementById("payment");
const PASSWORD = document.getElementById("password");
const CONFIRM_PASSWORD = document.getElementById("confirm-password");


const handleRegister = async(e)=>{
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
            console.log(form);
            console.log(JSON.stringify(form));
            const response = await fetch(`${appUrl}auth/register`, {
                method:"POST",
                body:form,
                credentials:'include'
            });

            const result = response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        
    }
}

FORM.addEventListener('submit',(e)=>{
    e.preventDefault();
    handleRegister();
})