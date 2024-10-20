document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const taskBody = document.getElementById("taskBody");
    const errorMessage = document.getElementById("errorMessage"); // Error message div
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const imageInput = document.getElementById("imageInput");
    const selectedImage = document.getElementById("selectedImage");

    // Function to display error messages
    const displayError = (message) => {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
    };

    // Function to fetch tasks
    const fetchTasks = (query = '') => {
        fetch(`backend.php?search=${query}`)
            .then(res => res.json())
            .then(data => {
                errorMessage.style.display = "none"; // Hide error message on success

                if (Array.isArray(data) && data.length > 0) {
                    taskBody.innerHTML = ''; // Clear existing tasks

                    data.forEach(task => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${task.task}</td>
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td style="background-color:${task.colorCode};">${task.colorCode}</td>
                        `;
                        taskBody.appendChild(row);
                    });
                } else {
                    displayError('No tasks available.'); // Show error if no tasks
                }
            })
            .catch(err => displayError('Error fetching tasks: ' + err.message)); // Handle fetch errors
    };

    // Event listener for searching tasks
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        fetchTasks(query); // Fetch tasks based on input
    });

    // Open the modal when the button is clicked
    document.getElementById("openModal").onclick = () => {
        modal.style.display = "block"; // Open modal
    };

    // Close the modal when the close button is clicked
    closeModal.onclick = () => {
        modal.style.display = "none"; // Close modal
    };

    // Close the modal when clicking outside of it
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none"; // Close modal
        }
    };

    // Handle image input change to display selected image
    imageInput.onchange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader
            reader.onload = (ev) => {
                selectedImage.src = ev.target.result; // Set image source
                selectedImage.style.display = "block"; // Show the selected image
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // Fetch tasks on page load
    fetchTasks();
    setInterval(fetchTasks, 3600000); // Refresh tasks every 60 minutes
});
