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
const EMAIL_ERROR_MESSAGE =document.getElementById("email-error-message");
const PASSWORD_ERROR_MESSAGE = document.getElementById("password-error-message");
const CONFIRM_ERROR_MESSAGE = document.getElementById("confirm-error-message");
const ALERT_BOX = document.getElementById("alert-box");
const ICON_PASSWORD  = document.getElementById("see-password");
const CONFIRM_ICON_PASSWORD  = document.getElementById("see-password-2");
const MEMBERSHIP_FEE_TEXT = document.getElementById("proof-placeholder-text");

const InputValidation = ()=>{
    const passwordValue = PASSWORD?.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const emailValue = EMAIL?.value;
    const emailRegex = /\S+@\S+\.\S+/;
    const confirmValue = CONFIRM_PASSWORD?.value;
    
    //validate email address, password strength using regexes
    // !/\S+@\S+\.\S+/.test(email.value)
    if(!emailRegex.test(emailValue) ){
        //send message
        EMAIL_ERROR_MESSAGE.innerText = 'Invalid email address';
        return false
        
    }
    if(!passwordRegex.test(passwordValue)){
        PASSWORD_ERROR_MESSAGE.innerText = 'min 8 characters, at least one uppercase letter, one lowercase letter and one number';
        return false;
    }

    if(confirmValue !== passwordValue){
        CONFIRM_ERROR_MESSAGE.innerText = 'Passwords do not match';
        return false;
        
    }
    //validated successfully
    else{
        return true;
    }
 
}

const handleAlertBox = (message, type)=>{
        console.log("working");
        ALERT_BOX.classList.add("alert-box");
        if(type === 'success'){
            ALERT_BOX.innerHTML = `
            <p class="alert-message success-alert-message">${message}</p>
        `
           
        }
        if(type === 'info'){
            ALERT_BOX.innerHTML = `
            <p class="alert-message info-alert-message">${message}</p>
        `
        
        }
        if(type === 'error'){
            ALERT_BOX.innerHTML = `
            <p class="alert-message error-alert-message">${message}</p>`
        }
       
  
        setTimeout(()=>{
            ALERT_BOX.classList.remove("alert-box");
            ALERT_BOX.style.display = 'none';
        }, 3000);
}

const handleTogglePassword = (icon, password)=>{
    if(icon?.classList?.contains('fa-eye')){
        icon?.classList?.remove("fa-eye");
        icon?.classList?.add("fa-eye-slash");
        password?.setAttribute("type", 'text');
    }
    else if(icon?.classList?.contains('fa-eye-slash')){
        icon?.classList?.remove("fa-eye-slash");
        icon?.classList?.add("fa-eye");
        password?.setAttribute("type", 'password');
    }
}

const handleViewFileName = ()=>{
    if(PAYMENT?.files[0]){
        const filename = PAYMENT?.files[0]?.name;
        MEMBERSHIP_FEE_TEXT.innerText = filename;
        MEMBERSHIP_FEE_TEXT.style.color = 'black';
    }
}


const handleRegister = async(e)=>{
    
    if(!InputValidation()){
        throw new Error("Failed to validate inputs");
        
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

            const result = await response.json();
            console.log(result);
            handleAlertBox("You have successfully signed up", "success");
        } catch (error) {
            console.log(error);
        }
        
    }
}


//Events
FORM.addEventListener('submit',(e)=>{
    e.preventDefault();
    handleRegister();
    //prevent reloading
})

ICON_PASSWORD.addEventListener("click",()=>{
    handleTogglePassword(ICON_PASSWORD, PASSWORD)
})

CONFIRM_ICON_PASSWORD.addEventListener("click",()=>{
    handleTogglePassword(CONFIRM_ICON_PASSWORD, CONFIRM_PASSWORD)
});

PAYMENT.addEventListener("change", handleViewFileName);