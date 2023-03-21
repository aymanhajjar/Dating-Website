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
const main_img = document.getElementById('img-main')
const img_one = document.getElementById('img-one')
const img_two = document.getElementById('img-two')
const img_three = document.getElementById('img-three')
const edit_fullname = document.getElementById('edit-fullname')
const edit_email = document.getElementById('edit-email')
const edit_age = document.getElementById('edit-age')
const edit_location = document.getElementById('edit-location')
const edit_gender = document.getElementById('edit-gender')
const edit_bio = document.getElementById('edit-bio')
const reset_form = document.getElementById('reset-form')
const email_reset = document.getElementById('email-reset')
const password_reset = document.getElementById('password-reset')
const error_reset = document.getElementById('errormessage-reset')
const users = document.getElementById('users')
const gender_filter = document.getElementById('gender-filter')
const age_filter = document.getElementById('age-filter')
const location_filter = document.getElementById('location-filter')
const edit_prof = document.getElementById('editprofile-container')
const main_img_prof = document.getElementById('img-main-prof')
const img_one_prof = document.getElementById('img-one-prof')
const img_two_prof = document.getElementById('img-two-prof')
const img_three_prof = document.getElementById('img-three-prof')
const name_prof = document.getElementById('name-prof')
const age_prof = document.getElementById('age-prof')
const location_prof = document.getElementById('location-prof')
const gender_prof = document.getElementById('gender-prof')
const bio_prof = document.getElementById('bio-prof')
const profile = document.getElementById('profile-container')
const block_btn = document.getElementById('block-btn')
const favorite_btn = document.getElementById('fav-btn')
const search_input = document.getElementById('search')
const convo_container = document.getElementById('convo-container')
const convo_popup = document.getElementById('convo-popup')
const message_input = document.getElementById('message-input')
const msg_btn = document.getElementById('msg-btn')
const browse_container = document.getElementById('browse')
const profile_dropdown = document.getElementById('profile-drop-container')
const website = {}
website.url = 'http://localhost:8000/api'
let jwt = localStorage.getItem('jwt')
let filter_age = ''
let filter_gender = ''
let filter_location = ''
let profile_id = -1
let user_id = -1
let conversation_id = -1

getUserData()
getData()

async function getUserData() {
    profile_dropdown.style.visibility = 'hidden'
    inbox.innerHTML = ''
    if(jwt != null) {
        profile_dropdown.style.visibility = 'visible'
        await axios({
            "method": "post",
            "url": `${website.url}/refresh`,
            headers: {
                'Authorization': 'Bearer ' + jwt
              }
        }).then((result) => {
            localStorage.setItem('jwt', result.data.authorisation.token)
            welcome.innerHTML = `Welcome, <b>${result.data.user.name}</b>`
            jwt = result.data.authorisation.token
            user_id = result.data.user.id

        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${website.url}/getconvos`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            if(result.data.convos.length == 0) {
                inbox.innerHTML = 'No messages to show!'
            } else {
                result.data.convos.forEach((convo) => {
                    let date = new Date(convo.created_at)
                    if(convo.seen == 0) {
                        inbox.innerHTML += `<div class="unread-message" onclick="getConversation(${convo.conversation_id})">
                        <span class="message-author"><b>${convo.user.name}</b></span>
                        <span class="message-content">${convo.content}</span>
                        <span class="message-date">${date.toLocaleString()}</span>
                        </div>`
                    }
                })
            }
        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${website.url}/getnotifications`,
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

        axios({
            "method": "get",
            "url": `${website.url}/getimages`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            let assigned = [img_three, img_two, img_one]
            result.data.images.forEach(img => {
                if(img.is_profile == 1) {
                    main_img.src = `${website.url}/storage/${img.path}`
                } else {
                    let unassigned = assigned.pop()
                    unassigned.src = `${website.url}/storage/${img.path}`
                }
            })
        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${website.url}/getinfo`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            let res = result.data.info[0]
            edit_fullname.value = res.user.name
            edit_email.value = res.user.email
            edit_age.value = res.age
            edit_gender.value = res.gender
            edit_location.value = res.location_id
        }).catch((err) => {
            console.error(err)
        });

        axios({
            "method": "get",
            "url": `${website.url}/getusers`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            users.innerHTML = ''
            result.data.forEach(person => {
                users.innerHTML += `
                <div id="${person.id}" class="user-card ${person.gender == 'male' ? 'male-card' : 'female-card'}" onclick="openProf(${person.user_id})">
                    ${ person.path ? `<img class="card-img" src="${website.url}/storage/${person.path.path}">` : `<img class="card-img" src="images/profile_pic.png">`}
                    <span class="card-name">${person.user_get.name}</span>
                </div>
                `
            })
        }).catch((err) => {
            console.error(err)
        });

    }
}

function getData() {
    axios({
        "method": "get",
        "url": `${website.url}/getlocations`,
    }).then((result) => {
        result.data.forEach((loc) => {
            location_selector.innerHTML += `<option value="${loc.id}">${loc.name}</option>`
            edit_location.innerHTML += `<option value="${loc.id}">${loc.name}</option>`
            location_filter.innerHTML += `<option value="${loc.id}">${loc.name}</option>`
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
        browse_container.classList.add('containerBlur')
        reset_form.classList.remove('openForm')
    } else if(form == 'login') {
        login_form.classList.add('openForm')
        main_container.classList.add('containerBlur')
        register_form.classList.remove('openForm')
        browse_container.classList.add('containerBlur')
        reset_form.classList.remove('openForm')
    } else if(form == 'reset') {
        login_form.classList.remove('openForm')
        main_container.classList.add('containerBlur')
        register_form.classList.remove('openForm')
        reset_form.classList.add('openForm')
        browse_container.classList.add('containerBlur')
    }
}

function closeForm() {
    register_form.classList.remove('openForm')
    login_form.classList.remove('openForm')
    reset_form.classList.remove('openForm')
    main_container.classList.remove('containerBlur')
}

function openEditProf() {
    edit_prof.classList.add('open-prof')
    main_container.classList.add('containerBlur')
    browse_container.classList.add('containerBlur')
}

function closeEditProf() {
    edit_prof.classList.remove('open-prof')
    browse_container.classList.remove('containerBlur')
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
                "url": `${website.url}/register`,
                'data': register_data
            }).then((result) => {
                localStorage.setItem('jwt', result.data.authorisation.token)
                location.reload() 
            }).catch((err) => {
                if(err.response.status == 500) {
                    error_login.innerHTML = 'Failed to validate'
                }
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
                "url": `${website.url}/login`,
                'data': login_data
            }).then((result) => {
                localStorage.setItem('jwt', result.data.authorisation.token)
                location.reload() 
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
    if(form == 'reset') {
        let reset_data = new FormData();
            reset_data.append('email', email_reset.value)
            reset_data.append('password', password_reset.value)

            axios({
                "method": "post",
                "url": `${website.url}/reset`,
                'data': reset_data
            }).then((result) => {
                closeForm()
            }).catch((err) => {
                if(err.response.status == 422) {
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

function uploadImage(id) {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    const image_data = new FormData()
    image_data.append('type', id)
    image_data.append('image', fileInput.files[0])

    axios.post(`${website.url}/updateimage`, image_data, {
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }).then(response => {
        var src = response.data.path;
        src += "?rand=" + Math.random();
        if(id == 'img-main') {
            main_img.src = `${website.url}/storage/${src}?timestamp=123456789`
        } else if (id == 'img-one') {
            img_one.src = `${website.url}/storage/${src}`
        } else if (id == 'img-two') {
            img_two.src = `${website.url}/storage/${src}`
        } else if (id == 'img-three') {
            img_three.src = `${website.url}/storage/${src}`
        }
      }).catch(error => {
        console.error(error);
      });

    })

    fileInput.click();
  }

  function updateInfo() {
    const info_data = new FormData()
    info_data.append('name', edit_fullname.value)
    info_data.append('email', edit_email.value)
    info_data.append('age', edit_age.value)
    info_data.append('location', edit_location.value)
    info_data.append('gender', edit_gender.value)
    info_data.append('bio', edit_bio.value)

    axios.post(`${website.url}/updateinfo`, info_data, {
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }).then(result => {
        closeEditProf()
      }).catch(error => {
        console.error(error);
      });
  }

  function filter(type) {
    filter_age = age_filter.value
    filter_gender = gender_filter.value
    filter_location = location_filter.value

    axios({
        "method": "get",
        "url": `${website.url}/filterusers?age=${filter_age}&gender=${filter_gender}&location=${filter_location}`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    }).then((result) => {
        users.innerHTML = ''
        result.data.forEach(person => {
            users.innerHTML += `
            <div id="${person.user_id}" class="user-card ${person.gender == 'male' ? 'male-card' : 'female-card'}" onclick="openProf(${person.user_id})">
                ${ person.path ? `<img class="card-img" src="${website.url}/storage/${person.path.path}">` : `<img class="card-img" src="images/profile_pic.png">`}
                <span class="card-name">${person.user_get.name}</span>
            </div>
            `
        })
    }).catch((err) => {
        console.error(err)
    });
  }

function openProf(id) {
    profile_id = id
    axios({
        "method": "get",
        "url": `${website.url}/getuser/${id}`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    }).then((result) => {
        person = result.data.info
        name_prof.innerHTML = person.user_get.name
        age_prof.innerHTML = person.age
        location_prof.innerHTML = person.location.name
        gender_prof.innerHTML = person.gender
        if(person.bio_prof) {
            bio_prof.innerHTML = person.bio_prof
        } else {
            bio_prof.innerHTML = "<i>No Bio</i>"
        }

        if(result.data.blocked == 'true') {
            block_btn.innerHTML = 'Unblock'
        } else {
            block_btn.innerHTML = 'Block'
        }

        if(result.data.favorite == 'true') {
            favorite_btn.innerHTML = 'Remove from favorites'
        } else {
            favorite_btn.innerHTML = 'Favorite'
        }

        main_img_prof.src = "images/profile_pic.png"
        img_one_prof.src = "images/image.png"
        img_two_prof.src = "images/image.png"
        img_three_prof.src = "images/image.png"
        if(person.photos.length > 0) {
            let assigned = [img_three_prof, img_two_prof, img_one_prof]
            person.photos.forEach(photo => {
                if(photo.is_profile == 1) {
                    main_img_prof.src = `${website.url}/storage/${photo.path}`
                } else {
                    let unassigned = assigned.pop()
                    unassigned.src = `${website.url}/storage/${photo.path}`
                }
            })
        }
        profile.classList.add('open-prof')
        main_container.classList.add('containerBlur')
        browse_container.classList.add('containerBlur')
    }).catch((err) => {
        console.error(err)
    });
  }

  function closeProf() {
        profile.classList.remove('open-prof')
        main_container.classList.remove('containerBlur')
        browse_container.classList.remove('containerBlur')
  }

  function block() {
    let block_data = new FormData()
    block_data.append('blocked_id', profile_id)

    axios({
        "method": "post",
        "url": `${website.url}/block`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        },
        data: block_data
    }).then((result) => {
        if(result.data == true) {
            block_btn.innerHTML = 'Unblock'
        } else {
            block_btn.innerHTML = 'Block'
        }
    }).catch((err) => {
        console.error(err)
    });
  }
  
  function favorite() {
    let fav_data = new FormData()
    fav_data.append('favorite_id', profile_id)

    axios({
        "method": "post",
        "url": `${website.url}/favorite`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        },
        data: fav_data
    }).then((result) => {
        if(result.data == true) {
            favorite_btn.innerHTML = 'Remove from favorites'
        } else {
            favorite_btn.innerHTML = 'Favorite'
        }
    }).catch((err) => {
        console.error(err)
    });
  }

  function search() {
    users.innerHTML = ''
    if(search_input.value.length > 0) {
        axios({
            "method": "get",
            "url": `${website.url}/search/${search_input.value}`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            users.innerHTML = ''
            result.data.forEach(person => {
                users.innerHTML += `
                <div id="${person.id}" class="user-card ${person.gender == 'male' ? 'male-card' : 'female-card'}" onclick="openProf(${person.user_id})">
                    ${ person.path ? `<img class="card-img" src="${website.url}/storage/${person.path.path}">` : `<img class="card-img" src="images/profile_pic.png">`}
                    <span class="card-name">${person.user_get.name}</span>
                </div>
                `
            })
        }).catch((err) => {
            console.error(err)
        });
    } else {
        axios({
            "method": "get",
            "url": `${website.url}/getusers`,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        }).then((result) => {
            users.innerHTML = ''
            result.data.forEach(person => {
                users.innerHTML += `
                <div id="${person.id}" class="user-card ${person.gender == 'male' ? 'male-card' : 'female-card'}" onclick="openProf(${person.user_id})">
                    ${ person.path ? `<img class="card-img" src="${website.url}/storage/${person.path.path}">` : `<img class="card-img" src="images/profile_pic.png">`}
                    <span class="card-name">${person.user_get.name}</span>
                </div>
                `
            })
        }).catch((err) => {
            console.error(err)
        });
    }
  }

  function logOut() {
    axios({
        "method": "post",
        "url": `${website.url}/logout`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    }).then((result) => {
        localStorage.removeItem('jwt')
        location.reload()
    }).catch((err) => {
        console.error(err)
    });
  }

  function scrollToDiv(div) {
    div == 'browse' ? browse_container.scrollIntoView({ behavior: 'smooth' }) : main_container.scrollIntoView({ behavior: 'smooth' })
  }

  function closeConvo() {
    convo_popup.classList.remove('openForm')
    main_container.classList.remove('containerBlur')
    browse_container.classList.remove('containerBlur')
  }

  function getConversation(id) {
    closeProf()
    axios({
        "method": "get",
        "url": id ? `${website.url}/getconvo?convo_id=${id}` : `${website.url}/getconvo?target_user=${profile_id}`,
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    }).then((result) => {
        if(result.data.messages.length > 0) {
            convo_container.innerHTML = ''
            result.data.messages.forEach(msg => {
                let date = new Date(msg.created_at)
                if(msg.author_id == user_id) {
                    convo_container.innerHTML += `<div class="message-right">
                    <h4>You</h4>
                    <p>${msg.content}</p>
                    <span class="time-right">${date.toLocaleString()}</span>
                    </div>`
                } else {
                    convo_container.innerHTML += `<div class="message-left">
                    <p>${msg.content}</p>
                    <span class="time-left">${date.toLocaleString()}</span>
                    </div>`
                }
            })

            conversation_id = id
        } else {
            convo_container.innerHTML = 'Start a conversation...'
            console.log(result.data['convo_id'])
            conversation_id = result.data['convo_id']
        }


        convo_popup.classList.add('openForm')
        main_container.classList.add('containerBlur')
        browse_container.classList.add('containerBlur')
    }).catch((err) => {
        console.error(err)
    });
  }

  message_input.addEventListener('keyup', (event)=> 
    {
        if (event.keyCode == 13) {
            convo_container.innerHTML += `<div class="message-right">
                <h4>You</h4>
                <p>${message_input.value}</p>
                </div>`

            let msg_data = new FormData()
            msg_data.append('message', message_input.value)
            msg_data.append('convo_id', conversation_id)
            console.log(conversation_id)

            axios({
                "method": "post",
                "url": `${website.url}/sendmessage`,
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
                data: msg_data
            }).then((result) => {
                
            }).catch((err) => {
                console.error(err)
            });
            message_input.value = ''
        }
  }) 
  