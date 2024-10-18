document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const taskBody = document.getElementById("taskBody");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const imageInput = document.getElementById("imageInput");
    const selectedImage = document.getElementById("selectedImage");

    const fetchTasks = () => {
        fetch('backend.php')
            .then(res => res.text())
            .then(rawResponse => {
                console.log('Raw Response:', rawResponse);
                try {
                    const tasks = JSON.parse(rawResponse);
                    console.log('Parsed Data:', tasks);
                    taskBody.innerHTML = '';

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
                    console.error('Error parsing JSON:', err);
                }
            })
            .catch(err => console.error('Error fetching tasks:', err));
    };

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        Array.from(taskBody.getElementsByTagName("tr")).forEach(row => {
            const match = Array.from(row.getElementsByTagName("td")).some(cell =>
                cell.innerText.toLowerCase().includes(query)
            );
            row.style.display = match ? "" : "none";
        });
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
    setInterval(fetchTasks, 3600000);
});
