import {appUrl} from './helpers.js';

const FORM_TITLE = document.querySelector('.auth-form-sub-title');
const LOADER = document.querySelector(".loader");
const STATUS = document.getElementById("verification-status");
const LOGIN_LINK = document.querySelector(".verification-login-link");
const ALERT_BOX = document.getElementById("alert-box");

//show alert message after registering
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

const handleGenerateToken = async()=>{
    try {
        const email = JSON.parse(localStorage.getItem("email")) ;
        console.log(email);
        const response = await fetch(`${appUrl}auth/resend-mail`, {
            method:'POST',
            credentials:'include',
            body:JSON.stringify({email:email})
        })

    } catch (error) {
        console.log(error);
    }
}


const handleVerify = async()=>{
    try {
        const token = window.location.pathname.slice(19);
        console.log(token);
        const response = await fetch(`${appUrl}auth/verify/${token}`, {
            method:'GET',
            credentials:'include'
        });
        const data = await response.json();
        console.log(data?.message);
        if(data?.message){
            handleAlertBox(data?.message, "info");
            STATUS.innerText = data?.message
            STATUS.innerHTML = `
                <span>${data?.message}</span><a href="#" id="generateToken"> Generate</a>
            `
            const GENERATE_TOKEN = document.getElementById("generateToken");
            GENERATE_TOKEN.addEventListener("click", handleGenerateToken);
        }
        
        
    } catch (error) {
        console.log(error);
        
    }
}

window.addEventListener("DOMContentLoaded", handleVerify);