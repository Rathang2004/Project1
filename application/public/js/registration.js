const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmpassword');
const form = document.getElementById("form");
const errorElement = document.getElementsByClassName('error');

const errorClass = (element,message) =>
{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}
const okClass = (element) =>
{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

form.addEventListener("submit", (e) =>
{
    if(!validateForm())
    {
        e.preventDefault();
    }
})
/*yo check the onsumbit functanitly*/

function validateForm()
{
    validateUsername();
    validatePassword();
    validateEmail();
    validateConfirmPassword();
    if (document.querySelectorAll('.success').length === 4)
    {
        // submit the form
        form.submit();
    }
}

/**
 * changed spelling
 */
function validateUsername()
{
    if((username.value === "") || (username.value === null))
    {
        errorClass(username, 'Username cannot be empty');
    }
    else if(username.value.length < 3)
    {
        errorClass(username, 'Username must be atleast 3 characters');
    }
    else if(!/^[a-zA-Z]/.test(username.value))
    {
        errorClass(username, 'Username must begin with [a-zA-Z]');
    }
    else
    {
        okClass(username);
    }
}

function validateEmail()
{
    if(email.value === "")
    {
        errorClass(email, 'Email can not be empty');
    }
/**    else if(email.value <  3)
    {
        errorClass(email, 'Email entered is invalid');
    }*/
    else
    {
        okClass(email);
    }
}

function validatePassword()
{
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (password.value === "") {
        errorClass(password, 'Password can not be empty');
    } else if (password.value.length < 8) {
        errorClass(password, 'Password has to be atleast 8 characters');
    }
    else if(!/[a-z]/.test(password.value) || !/[A-Z]/.test(password.value) || !/\d/.test(password.value) || !specialCharacters.test(password.value))
    {
        errorClass(password,'Password must contain 1 uppercase letter, 1 lowercase, 1 number, and one of the following characters: / * - + ! @ # $ ^ & ~ [ ]');
    }
    else
    {
        okClass(password);
    }
}

function validateConfirmPassword()
{
    if(confirmPassword.value === '')
    {
        errorClass(confirmPassword, 'Confirm password section can not be empty');
    }
    else if(confirmPassword.value != password.value)
    {
        errorClass(confirmPassword, 'Password entered doesn\'t match with the password above');
    }
    else
    {
        okClass(confirmPassword);
    }
}





/*

* first of all, figure out the checkbox stuff
* do the css
* figure out how to send a email push
* figure

 */











