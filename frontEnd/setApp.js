document.addEventListener('DOMContentLoaded', async function () {
    const profileFullName = document.getElementById('profile-fullname');
    const profileEmail = document.getElementById('profile-email');
    const profileUsername = document.getElementById('profile-username');
    const profilePhone = document.getElementById('profile-phone');
    const profilePassword = document.getElementById('profile-password');
    const profileConfirmPassword = document.getElementById('profile-confirm-password');
    const confirmPasswordField = profileConfirmPassword.parentElement;  // For hiding confirm password
    // Hide Confirm Password field initially
    confirmPasswordField.style.display = 'none';
    async function fetchUserProfile() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${localStorage.getItem('username')}`);
            const userData = await response.json();
            if (response.ok) {
                profileFullName.value = userData.fullName || '';
                profileEmail.value = userData.email || '';
                profileUsername.value = userData.username || '';
                profilePhone.value = userData.phone || '';
                profilePassword.value = userData.password || '';
                profileConfirmPassword.value = userData.password || '';
            } else {
                alert(`Error: ${userData.message}`);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    await fetchUserProfile();
    // Edit button click event
    document.getElementById('edit-profile').addEventListener('click', function () {
        profileFullName.disabled = false;
        profileEmail.disabled = false;
        profilePhone.disabled = false;
        profilePassword.disabled = false;
        profileConfirmPassword.disabled = false;
        confirmPasswordField.style.display = 'block';
        document.getElementById('save-profile').style.display = 'inline-block';
        document.getElementById('cancel-profile').style.display = 'inline-block';
        this.style.display = 'none';
    });
    // Cancel button click event
    document.getElementById('cancel-profile').addEventListener('click', function () {
        fetchUserProfile();
        profileFullName.disabled = true;
        profileEmail.disabled = true;
        profilePhone.disabled = true;
        profilePassword.disabled = true;
        profileConfirmPassword.disabled = true;
        confirmPasswordField.style.display = 'none';
        document.getElementById('save-profile').style.display = 'none';
        document.getElementById('cancel-profile').style.display = 'none';
        document.getElementById('edit-profile').style.display = 'inline-block';
    });
    // Save button click event
    document.getElementById('save-profile').addEventListener('click', async function () {
        if (profilePassword.value.trim() !== profileConfirmPassword.value.trim()) {
            alert('Passwords do not match. Please confirm your password correctly.');
            return;
        }
        const updatedUserData = {
            fullName: profileFullName.value.trim(),
            email: profileEmail.value.trim(),
            phone: profilePhone.value.trim(),
            password: profilePassword.value.trim()
        };
        if (!updatedUserData.fullName || !updatedUserData.email.includes('@') || updatedUserData.password.length < 6) {
            alert('Please fill out all fields correctly. The password must be at least 6 characters long.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/user/${localStorage.getItem('username')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });
            const result = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                profileFullName.disabled = true;
                profileEmail.disabled = true;
                profilePhone.disabled = true;
                profilePassword.disabled = true;
                profileConfirmPassword.disabled = true;
                confirmPasswordField.style.display = 'none';
                document.getElementById('save-profile').style.display = 'none';
                document.getElementById('cancel-profile').style.display = 'none';
                document.getElementById('edit-profile').style.display = 'inline-block';
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });
    // Toggle password visibility
    const togglePasswordButton = document.createElement('button');
    togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
    togglePasswordButton.classList.add('toggle-password-btn');
    profilePassword.parentNode.appendChild(togglePasswordButton);
    togglePasswordButton.addEventListener('click', function () {
        if (profilePassword.type === 'password') {
            profilePassword.type = 'text';
            profileConfirmPassword.type = 'text';
            togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            profilePassword.type = 'password';
            profileConfirmPassword.type = 'password';
            togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    });
    // Logout button
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('logout-btn');
    document.querySelector('.profile-section').appendChild(logoutButton);
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('username');
        window.location.href = 'signup.html';
    });
    // Navigation handling
    const homeSection = document.getElementById('home-section');
    const profileSection = document.getElementById('profile-section');
    const helpSection = document.createElement('section');
    helpSection .id = 'help-section';
    helpSection .classList.add('showcase');
    helpSection .style.display = 'none';
    //the next section help page is dynamically generated
    helpSection .innerHTML = `
        <div class="overlay">
            <div class="head">
                <button class="toggler">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="help-content">
              <div class="container">
        <h1>Frequently Asked Questions (FAQ)</h1>
        
        <div class="faq-item">
            <h3>What is Event Hub?</h3>
            <p>Event Hub is a web application designed to simplify event planning and attendance management. 
               Whether you're hosting a small gathering or a large conference, Event Hub allows you to create events, invite guests, 
               and track attendance effortlessly. Guests can confirm their participation using a unique Event ID, and once confirmed, 
               the event is automatically added to their integrated calendar. This ensures a seamless experience for both hosts and attendees, 
               eliminating the need for manual reminders and follow-ups.</p>
        </div>
        
        <div class="faq-item">
            <h3>How do I create an event?</h3>
            <p>To create an event:<br>
                1- Log in to your Event Hub account. <br>

                2- Navigate to "Calendar"<br>

                3- Click on the "Create Event" button.<br>

                4- Fill in the required event details.<br>

                5- Click "Submit" to generate an Event ID.<br>

                6- Copy and Share the Event ID with your guests!</p>
        </div>
        
        <div class="faq-item">
            <h3>How do guests confirm their attendance?</h3>
            <p>
             They will enter the given event ID from host in search bar at Dashboard and will be given the ability of confirming to attend the event
             and the event will be visible in their calendar.</p>
        </div>

        <div class="faq-item">
            <h3>Is there a limit to the number of events I can create?</h3>
            <p>
             No, you can create as many events as you need.</p>
        </div>

        <div class="faq-item">
            <h3>The event isn't showing. What should I do?</h3>
            <p>
             Double check the event ID given. Our web application works only by event ID so either Th event ID entered is 
             old, or not correct.</p>
        </div>

        <h1>Contact Us</h1>
        <div class="contact-info">
            <p><strong>Email:</strong> support@eventhub.com</p>
            <p><strong>Tele:</strong> 0112580286</p>
            <p><strong>Working hours:</strong> Available from 9 AM - 6 PM (UTC)</p>
        </div>
    </div>
            </div>
        </div>`;
    document.querySelector('main').appendChild(helpSection);
const dashboardSection = document.createElement('section');
dashboardSection.id = 'dashboard-section';
dashboardSection.classList.add('showcase');
dashboardSection.style.display = 'none';
dashboardSection.innerHTML = `
    <div class="overlay">
        <div class="head">
            <button class="toggler">
                <i class="fa-solid fa-bars-staggered"></i>
            </button>
        </div>
        <div class="dashboard-content">
            <h2>Welcome to the Dashboard1</h2>
        </div>
    </div>`;
document.querySelector('main').appendChild(dashboardSection);
const ServicesSection = document.createElement('section');
ServicesSection.id = 'services-section';
ServicesSection.classList.add('showcase');
ServicesSection.style.display = 'none';
ServicesSection.innerHTML = `
    <div class="overlay">
        <div class="head">
            <button class="toggler">
                <i class="fa-solid fa-bars-staggered"></i>
            </button>
        </div>
        <div class="services-content">
            <h2> Welcome to the Services </h2>
        </div>
    </div>`;
document.querySelector('main').appendChild(ServicesSection);
document.querySelector('.nav-list-item a[href="#home"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'block';
    profileSection.style.display = 'none';
    helpSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
});
document.querySelector('.nav-list-item a[href="#profile"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'block';
    helpSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
    fetchUserProfile();
});
document.querySelector('.nav-list-item a[href="#help"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    helpSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
});
document.querySelector('.nav-list-item a[href="#dashboard"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    helpSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    ServicesSection.style.display = 'none';
});
document.querySelector('.nav-list-item a[href="#services"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    helpSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'block';
});
    // Sidebar toggling
    const mainHead = document.querySelector('.main-head');
    const togglerButtons = document.querySelectorAll('.toggler');
    function toggleMenu() {
        mainHead.classList.toggle('active');
        homeSection.classList.toggle('width');
        profileSection.classList.toggle('width');
        helpSection.classList.toggle('width');
    }
    togglerButtons.forEach(button => {
        button.addEventListener('click', toggleMenu);
    });
});
