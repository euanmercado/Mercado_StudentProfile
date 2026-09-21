const DEFAULT_PROFILE = {
  fullName: "Euan Jorn Dy Mercado",
  course: "BS Information Technology",
  yearLevel: "3rd Year",
  aboutMe: "Welcome to my student profile application. I am passionate about web and mobile software development.",
  skills: "HTML5, CSS3, JavaScript, Cordova, Git",
  profileImage: "img/profile.jpeg"
};

function getProfileData() {
  const stored = localStorage.getItem("studentProfile");
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
}

function saveProfileData(data) {
  localStorage.setItem("studentProfile", JSON.stringify(data));
}

function renderProfile() {
  const profile = getProfileData();
  document.getElementById("display-name").textContent = profile.fullName;
  document.getElementById("display-course-year").textContent = `${profile.course} - ${profile.yearLevel}`;
  document.getElementById("display-about").textContent = profile.aboutMe;
  
  const photoEl = document.getElementById("display-photo");
  if (photoEl) {
    photoEl.src = profile.profileImage || "img/profile.jpeg";
  }

  const skillsContainer = document.getElementById("display-skills");
  skillsContainer.innerHTML = "";
  const skillsList = (profile.skills || "").split(",").map(s => s.trim()).filter(s => s.length > 0);
  skillsList.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsContainer.appendChild(li);
  });
}

function captureProfilePicture() {
  if (!navigator.camera) {
    alert("Unable to access the camera. Please check your device permissions.");
    return;
  }

  const cameraOptions = {
    quality: 60,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 400,
    targetHeight: 400
  };

  navigator.camera.getPicture(
    function onSuccess(imageData) {
      const imageSrc = "data:image/jpeg;base64," + imageData;
      const profile = getProfileData();
      profile.profileImage = imageSrc;
      saveProfileData(profile);
      renderProfile();
    },
    function onError(message) {
      if (message && (message.toLowerCase().includes("no image selected") || message.toLowerCase().includes("cancelled") || message.toLowerCase().includes("cancel"))) {
        console.log("Camera operation cancelled by user.");
        return;
      }
      alert("Unable to access the camera. Please check your device permissions.");
    },
    cameraOptions
  );
}

function openEditMode() {
  const profile = getProfileData();
  document.getElementById("input-name").value = profile.fullName;
  document.getElementById("input-course").value = profile.course;
  document.getElementById("input-year").value = profile.yearLevel;
  document.getElementById("input-about").value = profile.aboutMe;
  document.getElementById("input-skills").value = profile.skills;
  
  document.getElementById("error-message").style.display = "none";
  document.getElementById("profile-view").style.display = "none";
  document.getElementById("edit-view").style.display = "block";
}

function cancelEditMode() {
  document.getElementById("error-message").style.display = "none";
  document.getElementById("edit-view").style.display = "none";
  document.getElementById("profile-view").style.display = "block";
}

function handleSave(event) {
  event.preventDefault();
  
  const fullName = document.getElementById("input-name").value.trim();
  const course = document.getElementById("input-course").value.trim();
  const yearLevel = document.getElementById("input-year").value.trim();
  const aboutMe = document.getElementById("input-about").value.trim();
  const skills = document.getElementById("input-skills").value.trim();
  const errorMsg = document.getElementById("error-message");

  if (!fullName || !course || !yearLevel || !aboutMe || !skills) {
    errorMsg.textContent = "Please complete all required fields.";
    errorMsg.style.display = "block";
    return;
  }

  const currentProfile = getProfileData();
  const updatedProfile = { 
    ...currentProfile, 
    fullName, 
    course, 
    yearLevel, 
    aboutMe, 
    skills 
  };
  
  saveProfileData(updatedProfile);
  renderProfile();
  cancelEditMode();
}

document.addEventListener("deviceready", () => {
  renderProfile();
}, false);

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  document.getElementById("btn-edit").addEventListener("click", openEditMode);
  document.getElementById("btn-cancel").addEventListener("click", cancelEditMode);
  document.getElementById("edit-form").addEventListener("submit", handleSave);
  
  const changePhotoBtn = document.getElementById("btn-change-photo");
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener("click", captureProfilePicture);
  }
  
  const photoImg = document.getElementById("display-photo");
  if (photoImg) {
    photoImg.addEventListener("click", captureProfilePicture);
  }
});
