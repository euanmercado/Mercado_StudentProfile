document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) { document.addEventListener('DOMContentLoaded', onDeviceReady); }

let studentData = {
    studentId: "2021-100451",
    name: "Euan Jorn Dy Mercado",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    photo: null
};

function onDeviceReady() {
    loadSavedData();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('btn-change-photo').addEventListener('click', capturePhoto);
    document.getElementById('btn-edit-profile').addEventListener('click', openModal);
    document.getElementById('btn-cancel-edit').addEventListener('click', closeModal);
    document.getElementById('edit-form').addEventListener('submit', saveProfile);
    document.getElementById('btn-crud-delete').addEventListener('click', deleteAccount);
}

function loadSavedData() {
    const saved = localStorage.getItem('original_student_data');
    if (saved) {
        studentData = JSON.parse(saved);
    }
    updateUI();
}

function updateUI() {
    document.getElementById('view-name').textContent = studentData.name;
    document.getElementById('view-course-year').textContent = `${studentData.course} - ${studentData.yearLevel}`;
    document.getElementById('view-student-id').textContent = `ID: ${studentData.studentId}`;
    
    if (studentData.photo) {
        document.getElementById('profile-img').src = studentData.photo;
    }
}

function openModal() {
    document.getElementById('edit-name').value = studentData.name;
    document.getElementById('edit-course').value = studentData.course;
    document.getElementById('edit-year').value = studentData.yearLevel;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function saveProfile(e) {
    e.preventDefault();
    studentData.name = document.getElementById('edit-name').value.trim();
    studentData.course = document.getElementById('edit-course').value.trim();
    studentData.yearLevel = document.getElementById('edit-year').value.trim();

    localStorage.setItem('original_student_data', JSON.stringify(studentData));
    updateUI();
    closeModal();
    showToast("Profile Updated!");
}

function deleteAccount() {
    if (confirm("Are you sure you want to delete this profile record?")) {
        localStorage.removeItem('original_student_data');
        studentData = {
            studentId: "2021-100451",
            name: "Deleted Profile",
            course: "N/A",
            yearLevel: "N/A",
            photo: null
        };
        updateUI();
        showToast("Profile Deleted.");
    }
}

function capturePhoto() {
    if (!navigator.camera) {
        showToast("Camera unavailable on browser preview.");
        return;
    }

    const options = {
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
            const photoUrl = "data:image/jpeg;base64," + imageData.replace(/[\r\n]/g, '');
            studentData.photo = photoUrl;
            localStorage.setItem('original_student_data', JSON.stringify(studentData));
            updateUI();
            showToast("Photo updated!");
        },
        (error) => { showToast("Camera cancelled."); },
        options
    );
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
}
