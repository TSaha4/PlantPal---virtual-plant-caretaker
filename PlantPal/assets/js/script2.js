document.addEventListener("DOMContentLoaded", function () {
    // Get URL params
    const urlParams = new URLSearchParams(window.location.search);
    const plantData = urlParams.get("plantData");

    const headName = document.getElementById("name");
    const tips = document.getElementById("tips");
    const fun = document.getElementById("fun");
    const desc = document.getElementById("desc");

    const msg = document.getElementById("msg");

    function searchPlantData(name) {
        // get images
        const API_KEY = "AIzaSyCCkeFL1K6J7bDSqg7LLp3YCA32T8MWGOA";
        const CSE_ID = "70bd687978a5d4d5a";
        const query = encodeURIComponent(name + " plant");
        const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CSE_ID}&searchType=image&key=${API_KEY}&fields=items(link)`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const images = data.items.map(item => item.link); // Get all image links

                    if (images[0]) document.getElementById("plant-image1").src = images[0];
                    if (images[1]) document.getElementById("plant-image2").src = images[1];
                    if (images[2]) document.getElementById("plant-image3").src = images[2];

                } else {
                    console.log("No images found");
                }
            })
            .catch(error => console.error("Error fetching image:", error));

        // get description
        const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                desc.innerHTML = `<p>${data.extract}</p>`;
            })
            .catch(error => console.error("Error fetching image:", error));
    }

    if (plantData) {
        const plant = JSON.parse(decodeURIComponent(plantData));

        console.log("HeadName Element:", headName);
        headName.innerHTML = `<h2 style="margin-bottom: 0px">${plant.common_name}</h2>
                                <h3 style="margin-top: 2px; margin-left: 0px;"><i>(${plant.scientific_name})</i></h3>`;
        searchPlantData(plant.common_name);
        console.log("Plant Data Received:", plant);

        tips.innerHTML = `<ul style="margin: 20px 0; line-height: 1.0; word-spacing: 2px;">
                    <li style="margin-bottom: 10px;"><b>Water Frequency:</b>&nbsp;&nbsp;${plant.watering_frequency}</li>
                    <li style="margin-bottom: 10px;"><b>Soil:</b>&nbsp;&nbsp;${plant.soil}</li>
                    <li style="margin-bottom: 10px;"><b>Sunlight:</b>&nbsp;&nbsp;${plant.sunlight}</li>
                    <li style="margin-bottom: 10px;"><b>Other tips:</b>&nbsp;&nbsp;${plant.tips}</li>
                  </ul>`

        fun.innerHTML = `<p> ${plant.fun_fact} </p>`
    } else {
        console.log("No plant data found.");
        return;
    }

    // back button
    const back = document.getElementById("back-btn");
    back.addEventListener("click", () => {
        if (document.referrer) {
            window.history.back(); // Go to the previous page
        } else {
            window.location.href = "/index.html"; // go to index.html
        }
    });

    const plantInput = document.getElementById("plant-name");
    const imageInput = document.getElementById("image-upload");
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
        console.log("File input changed");
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
                    // Redirect to result.html with plant details
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

        if (imageFile) {
            msg.textContent = "Loading...";  
            msg.style.display = "block";// Make it visible
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
