document.addEventListener("DOMContentLoaded", function () {
    const plantInput = document.getElementById("plant-name");
    const imageInput = document.getElementById("image-upload");
    const searchButton = document.getElementById("search-button");

    const msg = document.getElementById('msg');

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
    imagePreviewContainer.style.border = "none";

    // Image preview
    const previewImage = document.createElement("img");
    previewImage.style.width = "35px";
    previewImage.style.height = "35px";
    previewImage.style.borderRadius = "5px";
    previewImage.style.objectFit = "cover";

    // Remove button
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

    // Show image preview
    imageInput.addEventListener("change", function () {
        if (imageInput.files && imageInput.files.length > 0) { 
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                imagePreviewContainer.style.display = "flex"; 
                plantInput.style.paddingLeft = "60px";
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    });

    // Remove image when clicking cross
    removeButton.addEventListener("click", function () {
        imageInput.value = ""; 
        previewImage.src = ""; 
        imagePreviewContainer.style.display = "none";
        plantInput.style.paddingLeft = "10px";
    });

    // Handle search
    searchButton.addEventListener("click", submitSearch);
    plantInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            submitSearch();
        }
    });

    function searchPlant(plantName) {
        plantName = plantName.toLowerCase();
        console.log("Searching JSON for:", plantName);
    
        fetch("/data/plants.json")
            .then(response => response.json())
            .then(plants => {
                const foundPlant = plants.find(plant =>
                    plant.common_name.toLowerCase() === plantName ||
                    plant.scientific_name.toLowerCase() === plantName
                );
    
                if (foundPlant) {
                    console.log("Plant Found:", foundPlant);
                    // Redirect to result.html
                    const plantData = encodeURIComponent(JSON.stringify(foundPlant));

                    // Redirect to result.html
                    window.location.href = `/result.html?plantData=${plantData}`;
                } else {
                    msg.textContent = "";
                    alert("Plant not found in database. Try another name.");
                }
            })
            .catch(error => {
                console.error("Error loading plant data:", error);
            });
    }
    

    function findPlant(imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];
    
            try {
                // Plant.id API
                const response = await fetch('https://api.plant.id/v2/identify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Api-Key': 'yZOd9mOlyXQtykbKeSr1WlO8aLddxPSgMxAMJqHRiqRaID19cG'
                    },
                    body: JSON.stringify({
                        images: [base64Image],
                        modifiers: ["crops_fast", "similar_images"],
                        plant_language: "en",
                        plant_details: ["common_names", "url", "wiki_description", "taxonomy"]
                    })
                });
    
                const data = await response.json();
                console.log("Plant API Response:", data);
    
                if (data && data.suggestions && data.suggestions.length > 0) {
                    const plantName = data.suggestions[0].plant_name.toLowerCase(); // Ensure case consistency
                    console.log("Identified Plant Name:", plantName);
                    
                    searchPlant(plantName);
                } else {
                    msg.textContent = "";
                    alert('Could not identify the plant. Try another image.');
                }
            } catch (error) {
                console.error("Error fetching plant identification:", error);
            }
        };
    }
    

    function submitSearch() {
        const plantName = plantInput.value.trim();
        const imageFile = imageInput.files && imageInput.files.length > 0 ? imageInput.files[0] : null;

        console.log("Plant Name:", plantName || "No Name Entered");
        if (imageFile) {
            console.log("Image Selected:", imageFile.name);
        }

        if (!plantName && !imageFile) { 
            msg.textContent = "Please give an input...";  
            msg.style.display = "block";  // Make it visible
            msg.style.color = "red";
            return;
        }

        if (imageFile) {
            msg.textContent = "Loading...";  
            msg.style.display = "block";
            msg.style.color = "white";
            findPlant(imageFile);
        }
        else if (plantName) {
            msg.textContent = "Loading..."; 
            msg.style.display = "block";
            msg.style.color = "white";
            searchPlant(plantName);
        }
    }
});
