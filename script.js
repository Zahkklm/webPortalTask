document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const taskBody = document.getElementById("taskBody");
    const errorMessage = document.getElementById("errorMessage");  // Error message div
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const imageInput = document.getElementById("imageInput");
    const selectedImage = document.getElementById("selectedImage");

    const displayError = (message) => {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
    };

    const fetchTasks = (query = '') => {
        fetch(`backend.php?search=${query}`)
            .then(res => res.json())
            .then(data => {
                errorMessage.style.display = "none";  // Hide error message on success

                if (Array.isArray(data) && data.length > 0) {
                    taskBody.innerHTML = '';

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
                    displayError('No tasks available.');
                }
            })
            .catch(err => displayError('Error fetching tasks: ' + err.message));
    };

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        fetchTasks(query);
    });

    document.getElementById("openModal").onclick = () => modal.style.display = "block";
    closeModal.onclick = () => modal.style.display = "none";

    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                selectedImage.src = ev.target.result;
                selectedImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    fetchTasks();
    setInterval(fetchTasks, 3600000);  // Refresh every 60 minutes
});
