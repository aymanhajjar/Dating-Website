const register_form = document.getElementById('register-form')
const login_form = document.getElementById('login-form')
const fullname_reg = document.getElementById('fullname-register')
const email_reg = document.getElementById('email-register')
const password_reg = document.getElementById('password-register')
const confirm_pass = document.getElementById('confirm-password')
const age = document.getElementById('age')
const gender = document.getElementById('gender')
const location_selector = document.getElementById('location')
const email_login = document.getElementById('email-login')
const password_login = document.getElementById('password-login')
const error = document.getElementById('errormessage')
const error_login = document.getElementById('errormessage-login')
const main_container = document.getElementById('home-container')
const welcome = document.getElementById('welcome')
const inbox = document.getElementById('inbox')
const notifications = document.getElementById('notifications')
const url = 'http://localhost:8000/api'
let jwt = localStorage.getItem('jwt')

console.log(jwt)
getUserData()
getData()


async function getUserData() {
    inbox.innerHTML = ''
    if(jwt != null) {
        await axios({
            "method": "post",
            "url": `${url}/refresh`,
            headers: {
                'Authorization': 'Bearer ' + jwt
              }
        }).then((result) => {
            localStorage.setItem('jwt', result.data.authorisation.token)
            welcome.innerHTML = `Welcome, <b>${result.data.user.name}</b>`
            jwt = result.data.authorisation.token
        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${url}/getconvos`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            if(result.data.convos.length == 0) {
                inbox.innerHTML = 'No messages to show!'
            } else {
                result.data.convos.forEach((convo) => {
                    if(convo.seen == 0) {
                        inbox.innerHTML += `<div class="unread-message">
                        <span class="message-author"><b>${convo.user.name}</b></span>
                        <span class="message-content">${convo.content}</span>
                        <span class="message-date">${convo.created_at}</span>
                        </div>`
                    }
                })
            }
        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${url}/getnotifications`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            if(result.data.notifications.length == 0) {
                notifications.innerHTML = 'No new notifications!'
            } else {
                result.data.notifications.forEach((notf) => {
                    if(notf.seen == 0) {
                        notifications.innerHTML += `<div class="unread-message">
                        <span class="message-author"><b>${notf.target_user.name}</b></span>
                        <span class="message-content">${notf.content}</span>
                        </div>`
                    }
                })
            }
        }).catch((err) => {
            console.error(err)
        });

    }
}

function getData() {
    axios({
        "method": "get",
        "url": `${url}/getlocations`,
    }).then((result) => {
        result.data.forEach((loc) => {
            location_selector.innerHTML += `<option value="${loc.id}">${loc.name}</option>`
        })
    }).catch((err) => {
        console.error(err)
    });
}

function openForm(form) {
    if(form == 'register') {
        register_form.classList.add('openForm')
        main_container.classList.add('containerBlur')
        login_form.classList.remove('openForm')
    } else if(form == 'login') {
        login_form.classList.add('openForm')
        main_container.classList.add('containerBlur')
        register_form.classList.remove('openForm')
    }
}

function closeForm() {
    register_form.classList.remove('openForm')
    login_form.classList.remove('openForm')
    main_container.classList.remove('containerBlur')
}

function submitForm(form) {
    if(form == 'register') {
        if(validateForm()) {
            let register_data = new FormData();
            register_data.append('fullname', fullname_reg.value)
            register_data.append('email', email_reg.value)
            register_data.append('password', password_reg.value)
            register_data.append('age', age.value)
            register_data.append('gender', gender.value)
            register_data.append('location', location_selector.value)

            axios({
                "method": "post",
                "url": `${url}/register`,
                'data': register_data
            }).then((result) => {
                console.log(result)
            }).catch((err) => {
                console.error(err)
            });
        }
    }

    if(form == 'login') {
        let login_data = new FormData();
            login_data.append('email', email_login.value)
            login_data.append('password', password_login.value)

            axios({
                "method": "post",
                "url": `${url}/login`,
                'data': login_data
            }).then((result) => {
                localStorage.setItem('jwt', result.data.authorisation.token)
            }).catch((err) => {
                if(err.response.status == 401) {
                    error_login.innerHTML = 'Wrong email/password'
                } else if(err.response.status == 422) {
                    error_login.innerHTML = 'Wrong email/password formats'
                }
                else {
                    console.error(err)
                }
            });
    }
}

function validateForm() {
    let email_regex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    let password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    error.innerHTML = ''

    if(fullname_reg.value.length == 0) {
        error.innerHTML = 'Please provide your full name!'
        fullname_reg.classList.add('errorField')
        return false
    }
    if(!email_reg.value.match(email_regex) || email_reg.value.length == 0) {
        error.innerHTML = 'Please provide a valid email!'
        email_reg.classList.add('errorField')
        return false
    }
    if(!password_reg.value.match(password_regex) || password_reg.value.length == 0) {
        error.innerHTML = "Password must contain at least one uppercase letter, one lowercase letter, one symbol, one number, and 8 characters minimum!"
        password_reg.classList.add('errorField')
        return false
    }
    if(password_reg.value != confirm_pass.value) {
        error.innerHTML = "Passwords don't match!"
        password_reg.classList.add('errorField')
        confirm_pass.classList.add('errorField')
        return false
    }
    if(age.value < 10 || age.value == '') {
        error.innerHTML = "Please provide your real age!"
        age.classList.add('errorField')
        return false
    }
    if(gender.value == '') {
        error.innerHTML = "Please specify your gender!"
        gender.classList.add('errorField')
        return false
    }
    if(location_selector.value == '') {
        error.innerHTML = "Please specify your location!"
        location_selector.classList.add('errorField')
        return false
    }
    return true
}