document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) { document.addEventListener('DOMContentLoaded', onDeviceReady); }

const DEFAULT_AVATAR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAADvElEQVR4nO2du3ncQAyEcfc5d+ga5FCRa1GB6sItKFUrzuyIMo/HJfcBYAfg/LmOu/Nz+BZ5+/7j519JxMv7x9Dff769Ko0Eg1tkwaMya4ksPZRgL6FnRBIOLxhFagl02ZCC0aWWQJQNJTiq2C1IoiEEZxG7BUH0VMFZxW6ZKXqK4KuI3TJD9N17gVeVKzJn7m4NvrLYPbza7NJgyn3GKxNzwZRbxiMbs000xbZhtck2aTDltmOVmbpgyu3HIjtVwZQ7jnaGaoIpVw/NLFUEU64+WpkOC6ZcOzSyHRJMufaMZtwtmHL9GMm6SzDl+tObufvdJOJLs2C2dx492Tddi44ot+Yab7R5tVy3rhYcKYSRC/dR5lk7x2/G43BF447M8htRRJ9R1WD0yVo+HYE895p5nx5kIU9QxP7RF4RHX0vUuAl9muQVPrLkMw4FI7fXO3RUyWeOQjZ4Vtioko8oCkZt7+yQZy9/jyNXoRqMEi7KOGrYFYzaXlKm5CxMg9FagzaeEk+C2d647LkL0WDUtqCOa00IwaSfB8HcPMdn6xC+weibQfTxwQsmY3wJ5uY5D2uXbHByKDg5FJycuwj3vxlZnLLByaHg5MALRt99oI8PXjAZ446+BpJ+Xt4/YjQYdSVEHdeaEIJJP2EEo7UFbTwlwggmfYQSjNIalHHUEEqwyPxwZy+/lXCCReaFHE2uSFDBIv5hR5QrEliwiF/oUeWKBBcsYh9+ZLkiIrdfv/9M/zCWFppPOEYXu5BK8MIV3rJTS0rBazK+J6uF9IKvTviDLHLMHf1fL0g/n2+vbHB2KDg5FJycVC8jXeB58H++XkYadWIeB4kRs1lyCdfgGUf922VGEh5CMNqp3Ho86LKhBaOJ3QP9BeIPLwRHGWQEsSUQMlznB9XgyGIX0BoNcx6cQe4alPk8fbPBe81DCcISz0y3eU5t8BXkisyd5zTBV5G7MGu+T4I9BnI1uQszvhDj3uCryl3wnv+uYKtBxF3ugkUOpd90azDlPuKVR1Gw5gAodx+tXI5+x7zBlHuMdT6HgikHnzNHpg3mClKHZU6ngnsXTrlt9OSl8nnZ3oUTW2qdwNxNIjZUC25pMRvfR21uLfk2NZji5tPqoHkTTcnz6MlefR/MFWAM7fy6BFOiP72ZdzeYkv0YyXpoE03J9oxmPLwPpmQ7NLJVOciiZH20MlU7iqZkPTSzfHoumuSC16KTQ8HJoeDkUHByKDg5FJwcCk4OBSeHgpNDwcmh4ORQcHIoODkUnBwKTs4/A8dYjXooNr4AAAAASUVORK5CYII=";

const DBEngine = {
    dbName: "StudentProfileDB",
    dbVersion: 4,
    db: null,

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (db.objectStoreNames.contains("students")) {
                    db.deleteObjectStore("students");
                }
                const store = db.createObjectStore("students", { keyPath: "studentId" });
                store.createIndex("email", "email", { unique: true });
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                this.seedInitialData().then(resolve);
            };
            request.onerror = (e) => reject("Database initialize error: " + e.target.error);
        });
    },

    seedInitialData() {
        return new Promise((resolve) => {
            const tx = this.db.transaction(["students"], "readwrite");
            const store = tx.objectStore("students");
            const check = store.get("2021-100451");
            check.onsuccess = () => {
                if (!check.result) {
                    store.put({
                        studentId: "2021-100451",
                        email: "euan@xu.edu.ph",
                        password: "password123",
                        name: "Euan Jorn Dy Mercado",
                        course: "BS Information Technology",
                        yearLevel: "3rd Year",
                        about: "Passionate software development student specializing in mobile app engineering.",
                        skills: "HTML5, CSS3, JavaScript, Cordova, Git, Database",
                        profilePicture: DEFAULT_AVATAR
                    });
                }
                resolve();
            };
        });
    },

    getStudent(studentId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(["students"], "readwrite");
            const store = tx.objectStore("students");
            const request = store.get(studentId);
            request.onsuccess = () => {
                if (!request.result && (studentId === "2021-100451" || studentId === "euan@xu.edu.ph")) {
                    const demoAccount = {
                        studentId: "2021-100451",
                        email: "euan@xu.edu.ph",
                        password: "password123",
                        name: "Euan Jorn Dy Mercado",
                        course: "BS Information Technology",
                        yearLevel: "3rd Year",
                        about: "Passionate software development student specializing in mobile app engineering.",
                        skills: "HTML5, CSS3, JavaScript, Cordova, Git, Database",
                        profilePicture: DEFAULT_AVATAR
                    };
                    store.put(demoAccount);
                    resolve(demoAccount);
                } else {
                    resolve(request.result);
                }
            };
            request.onerror = () => reject("Failed to retrieve profile record.");
        });
    },

    saveStudent(studentData) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(["students"], "readwrite");
            const store = tx.objectStore("students");
            const request = store.put(studentData);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject("Failed to save record to database.");
        });
    },

    deleteStudent(studentId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(["students"], "readwrite");
            const store = tx.objectStore("students");
            const request = store.delete(studentId);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject("Failed to delete record.");
        });
    }
};

let currentSessionUser = null;

function onDeviceReady() {
    DBEngine.init().then(() => {
        checkSession();
        setupEventListeners();
    }).catch(err => showToast(err, true));
}

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('btn-edit-profile').addEventListener('click', openEditModal);
    document.getElementById('btn-cancel-edit').addEventListener('click', closeEditModal);
    document.getElementById('edit-form').addEventListener('submit', handleSaveProfile);
    document.getElementById('btn-change-photo').addEventListener('click', capturePhoto);
    document.getElementById('btn-crud-delete').addEventListener('click', handleDeleteAccount);

    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });

    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    const activeNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const idInput = document.getElementById('login-id').value.trim();
    const passInput = document.getElementById('login-password').value.trim();
    const errorBox = document.getElementById('login-error');

    errorBox.classList.add('hidden');

    if (!idInput || !passInput) {
        showError(errorBox, "Please provide both Student ID/Email and Password.");
        return;
    }

    try {
        const student = await DBEngine.getStudent(idInput);
        if (student && student.password === passInput) {
            localStorage.setItem('auth_token', student.studentId);
            currentSessionUser = student;
            showProfileView(student);
            showToast("Login Successful!");
        } else {
            showError(errorBox, "Invalid student ID/email or password.");
        }
    } catch (err) {
        showError(errorBox, "Unable to retrieve profile. Please try again.");
    }
}

function handleLogout() {
    localStorage.removeItem('auth_token');
    currentSessionUser = null;
    document.getElementById('profile-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-form').reset();
    showToast("Logged out successfully.");
}

function checkSession() {
    const savedId = localStorage.getItem('auth_token');
    if (savedId) {
        DBEngine.getStudent(savedId).then(student => {
            if (student) {
                currentSessionUser = student;
                showProfileView(student);
            } else {
                handleLogout();
            }
        });
    }
}

function showProfileView(student) {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('profile-page').classList.remove('hidden');

    document.getElementById('view-name').textContent = student.name;
    document.getElementById('view-course-year').textContent = `${student.course} - ${student.yearLevel}`;
    document.getElementById('view-student-id').textContent = `ID: ${student.studentId}`;
    document.getElementById('view-about').textContent = student.about;
    document.getElementById('view-contact-email').textContent = student.email;
    document.getElementById('view-contact-id').textContent = student.studentId;

    const imgElem = document.getElementById('profile-img');
    const pic = student.profilePicture;
    const isBase64 = pic && pic.startsWith("data:image/");

    if (!isBase64) {
        student.profilePicture = DEFAULT_AVATAR;
        DBEngine.saveStudent(student);
        imgElem.src = DEFAULT_AVATAR;
    } else {
        imgElem.src = pic;
    }

    const skillsContainer = document.getElementById('view-skills');
    skillsContainer.innerHTML = '';
    student.skills.split(',').forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill.trim();
        skillsContainer.appendChild(li);
    });

    switchTab('profile');
}

function openEditModal() {
    if (!currentSessionUser) return;
    document.getElementById('edit-name').value = currentSessionUser.name;
    document.getElementById('edit-course').value = currentSessionUser.course;
    document.getElementById('edit-year').value = currentSessionUser.yearLevel;
    document.getElementById('edit-about').value = currentSessionUser.about;
    document.getElementById('edit-skills').value = currentSessionUser.skills;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

async function handleSaveProfile(e) {
    e.preventDefault();
    const updated = {
        ...currentSessionUser,
        name: document.getElementById('edit-name').value.trim(),
        course: document.getElementById('edit-course').value.trim(),
        yearLevel: document.getElementById('edit-year').value.trim(),
        about: document.getElementById('edit-about').value.trim(),
        skills: document.getElementById('edit-skills').value.trim()
    };

    try {
        await DBEngine.saveStudent(updated);
        currentSessionUser = updated;
        showProfileView(updated);
        closeEditModal();
        showToast("Profile Updated Successfully!");
    } catch (err) {
        showError(document.getElementById('edit-error'), "Unable to update profile.");
    }
}

async function handleDeleteAccount() {
    if (confirm("Are you sure you want to delete this profile record from the database? (CRUD Delete)")) {
        try {
            await DBEngine.deleteStudent(currentSessionUser.studentId);
            showToast("Record Deleted from Database.");
            handleLogout();
        } catch (err) {
            showToast("Failed to delete record.", true);
        }
    }
}

function capturePhoto() {
    if (!navigator.camera) {
        showToast("Camera not available on web preview.");
        return;
    }

    const cameraOptions = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        encodingType: navigator.camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        correctOrientation: true
    };

    navigator.camera.getPicture(
        (imageData) => {
            if (imageData && imageData.length > 50) {
                const cleanData = imageData.replace(/[\r\n]/g, '');
                const photoUrl = "data:image/jpeg;base64," + cleanData;
                updatePhoto(photoUrl);
            }
        },
        (error) => { showToast("Camera cancelled or failed.", true); },
        cameraOptions
    );
}

async function updatePhoto(photoUrl) {
    currentSessionUser.profilePicture = photoUrl;
    await DBEngine.saveStudent(currentSessionUser);
    const imgElem = document.getElementById('profile-img');
    imgElem.src = photoUrl;
    showToast("Profile picture updated!");
}

function showError(elem, text) {
    elem.textContent = text;
    elem.classList.remove('hidden');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = isError ? "#ef4444" : "#10b981";
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}
