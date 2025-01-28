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
            const response = await fetch(`http://localhost:5000/api/user/${localStorage.getItem('username')}`);
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
            const response = await fetch(`http://localhost:5000/api/user/${localStorage.getItem('username')}`, {
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
    const contactSection = document.createElement('section');
    contactSection.id = 'contact-section';
    contactSection.classList.add('showcase');
    contactSection.style.display = 'none';
    contactSection.innerHTML = `
        <div class="overlay">
            <div class="head">
                <button class="toggler">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="contact-content">
                <h2>This is Contact</h2>
                <p>Welcome to the Contact Page</p>
            </div>
        </div>`;
    document.querySelector('main').appendChild(contactSection);

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
    contactSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
});

document.querySelector('.nav-list-item a[href="#profile"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'block';
    contactSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
    fetchUserProfile();
});

document.querySelector('.nav-list-item a[href="#contact"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    contactSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    ServicesSection.style.display = 'none';
});

document.querySelector('.nav-list-item a[href="#dashboard"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    contactSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    ServicesSection.style.display = 'none';
});
document.querySelector('.nav-list-item a[href="#services"]').addEventListener('click', function (e) {
    e.preventDefault();
    homeSection.style.display = 'none';
    profileSection.style.display = 'none';
    contactSection.style.display = 'none';
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
        contactSection.classList.toggle('width');
    }

    togglerButtons.forEach(button => {
        button.addEventListener('click', toggleMenu);
    });
});
