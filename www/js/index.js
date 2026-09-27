document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) { document.addEventListener('DOMContentLoaded', onDeviceReady); }

const defaultPhotoPath = "img/profile.jpg";

const DBEngine = {
    dbName: "StudentProfileDB",
    dbVersion: 15, // Reset database to force reloading valid photo
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
                        profilePicture: defaultPhotoPath
                    });
                }
                resolve();
            };
        });
    },

    getStudent(studentId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(["students"], "readonly");
            const store = tx.objectStore("students");
            const request = store.get(studentId);
            request.onsuccess = () => resolve(request.result);
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

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const activeContent = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);

    if (activeContent) activeContent.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active');
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
    
    const profileImg = document.getElementById('profile-img');
    profileImg.onerror = function() {
        this.onerror = null;
        this.src = 'img/profile.png';
    };
    
    if (student.profilePicture) {
        profileImg.src = student.profilePicture;
    } else {
        profileImg.src = defaultPhotoPath;
    }

    const skillsContainer = document.getElementById('view-skills');
    skillsContainer.innerHTML = '';
    student.skills.split(',').forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill.trim();
        skillsContainer.appendChild(li);
    });
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
            if (imageData) {
                const cleanData = imageData.replace(/(\r\n|\n|\r)/gm, "");
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
    document.getElementById('profile-img').src = photoUrl;
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
