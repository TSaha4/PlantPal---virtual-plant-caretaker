document.addEventListener("DOMContentLoaded", function () {
    const plantInput = document.getElementById("plant-name");
    const imageInput = document.getElementById("image-upload");
    const cameraIcon = document.getElementById("camera-icon");
    const searchButton = document.getElementById("search-button");

    const searchContainer = document.querySelector(".search-container");
    searchContainer.style.display = "flex";
    searchContainer.style.alignItems = "center";
    searchContainer.style.position = "relative";

    // Image preview container
    const imagePreviewContainer = document.createElement("div");
    imagePreviewContainer.style.display = "none"; // Hidden by default
    imagePreviewContainer.style.position = "absolute";
    imagePreviewContainer.style.left = "10px";
    imagePreviewContainer.style.top = "50%";
    imagePreviewContainer.style.transform = "translateY(-50%)";
    imagePreviewContainer.style.alignItems = "center";
    imagePreviewContainer.style.gap = "5px";
    imagePreviewContainer.style.border = "none"; // Ensure no border by default

    // Image preview
    const previewImage = document.createElement("img");
    previewImage.style.width = "35px";
    previewImage.style.height = "35px";
    previewImage.style.borderRadius = "5px";
    previewImage.style.objectFit = "cover";

    // Remove button (red ❌)
    const removeButton = document.createElement("span");
    removeButton.innerHTML = "×";
    removeButton.style.color = "white";
    removeButton.style.fontSize = "14px";
    removeButton.style.fontWeight = "bold";
    removeButton.style.width = "16px";
    removeButton.style.height = "16px";
    removeButton.style.textAlign = "center";
    removeButton.style.borderRadius = "50%";
    removeButton.style.background = "red";
    removeButton.style.cursor = "pointer";
    removeButton.style.display = "flex";
    removeButton.style.alignItems = "center";
    removeButton.style.justifyContent = "center";

    imagePreviewContainer.appendChild(previewImage);
    imagePreviewContainer.appendChild(removeButton);
    searchContainer.insertBefore(imagePreviewContainer, plantInput);

    // Clear file input on page reload
    imageInput.value = "";

    // Open file picker when clicking the camera icon
    cameraIcon.addEventListener("click", function () {
        imageInput.click();
    });

    // Show image preview
    imageInput.addEventListener("change", function () {
        console.log("File input changed"); // Debugging
        if (imageInput.files && imageInput.files.length > 0) { // Ensure file is selected
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                imagePreviewContainer.style.display = "flex"; // Show container
                plantInput.style.paddingLeft = "60px";
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    });

    // Remove image when clicking ❌
    removeButton.addEventListener("click", function () {
        imageInput.value = ""; // Clear file input
        previewImage.src = ""; // Clear image preview
        imagePreviewContainer.style.display = "none"; // Hide container
        plantInput.style.paddingLeft = "10px"; // Restore padding
    });

    // Handle search
    searchButton.addEventListener("click", submitSearch);
    plantInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            submitSearch();
        }
    });

    function submitSearch() {
        const plantName = plantInput.value.trim();
        const imageFile = imageInput.files && imageInput.files.length > 0 ? imageInput.files[0] : null;

        console.log("Plant Name:", plantName || "No Name Entered");
        if (imageFile) {
            console.log("Image Selected:", imageFile.name);
        }
    }
});
