/**
 * Initializes event listeners and fetches tasks when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    // DOM element references
    const searchInput = document.getElementById("search");
    const taskBody = document.getElementById("taskBody");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const imageInput = document.getElementById("imageInput");
    const selectedImage = document.getElementById("selectedImage");

    /**
     * Fetches tasks from the backend and displays them in the table.
     */
    const fetchTasks = () => {
        fetch('backend.php') // Make a fetch request to backend.php
            .then(res => res.text()) // Read the response as text
            .then(rawResponse => {
                console.log('Raw Response:', rawResponse);
                try {
                    // Parse the raw response as JSON
                    const tasks = JSON.parse(rawResponse);
                    console.log('Parsed Data:', tasks);

                    // Clear the current table body
                    taskBody.innerHTML = '';

                    // Iterate through each task and add it to the table
                    tasks.forEach(task => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${task.task}</td>
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td style="background-color:${task.colorCode};">${task.colorCode}</td>
                        `;
                        taskBody.appendChild(row);
                    });
                } catch (err) {
                    console.error('Error parsing JSON:', err); // Log parsing errors
                }
            })
            .catch(err => console.error('Error fetching tasks:', err)); // Log any fetch errors
    };

    /**
     * Filters the tasks based on the search query input by the user.
     */
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase(); // Convert the search input to lowercase
        // Iterate over each row in the task table and filter based on the query
        Array.from(taskBody.getElementsByTagName("tr")).forEach(row => {
            const match = Array.from(row.getElementsByTagName("td")).some(cell =>
                cell.innerText.toLowerCase().includes(query)
            );
            row.style.display = match ? "" : "none"; // Show or hide rows based on the query match
        });
    });

    // Open the modal when the button is clicked
    document.getElementById("openModal").onclick = () => modal.style.display = "block";
    
    // Close the modal when the close button is clicked
    closeModal.onclick = () => modal.style.display = "none";

    /**
     * Displays a selected image in the modal when an image is chosen from the file input.
     */
    imageInput.onchange = (e) => {
        const file = e.target.files[0]; // Get the first file from the file input
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                selectedImage.src = ev.target.result; // Set the image source to the file data
                selectedImage.style.display = "block"; // Make the image visible
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        }
    };

    // Close the modal if the user clicks outside of it
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    fetchTasks(); // Initial task fetch when the page loads
    setInterval(fetchTasks, 3600000); // Refresh tasks every hour (3600000 milliseconds)
});
