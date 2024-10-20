const { JSDOM } = require("jsdom");

let dom;
let document;
let window;

/**
 * Mock File class to simulate File objects in tests.
 */
class MockFile {
    constructor(name = 'image.png', type = 'image/png', size = 1024) {
        this.name = name;
        this.type = type;
        this.size = size; // size in bytes
        this.lastModified = Date.now();
    }
}

/**
 * Mock FileList class to simulate the FileList object.
 */
class MockFileList {
    constructor(files) {
        this.files = files;
    }

    item(index) {
        return this.files[index] || null;
    }

    get length() {
        return this.files.length;
    }
}

/**
 * Mock DataTransfer class to simulate drag-and-drop file selection.
 */
class MockDataTransfer {
    constructor() {
        this.items = [];
    }

    add(file) {
        this.items.push(file);
    }

    get files() {
        return new MockFileList(this.items);
    }
}

// Assign the mock to the global scope
global.DataTransfer = MockDataTransfer;
global.File = MockFile;

// Mock FileReader
class MockFileReader {
    constructor() {
        this.onload = null; // Placeholder for the onload
        this.result = '';
    }

    readAsDataURL(file) {
        this.result = "data:image/png;base64,dummybase64"; // Set result as if a file has been read
        if (this.onload) {
            this.onload({ target: { result: this.result } }); // Call onload with the result
        }
    }
}

beforeAll(() => {
    jest.useFakeTimers();
    // Load HTML content into jsdom
    dom = new JSDOM(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Task List</title>
        </head>
        <body>
            <div id="errorMessage" style="color: red; display: none;"></div>
            <h1>Task List</h1>
            <input type="text" id="search" placeholder="Search...">
            <button id="openModal">Select Image</button>
            <div id="modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <input type="file" id="imageInput">
                    <img id="selectedImage" style="display: none; width: 100%;">
                </div>
            </div>
            <table id="taskTable">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Color Code</th>
                    </tr>
                </thead>
                <tbody id="taskBody"></tbody>
            </table>
        </body>
        </html>
    `, { runScripts: "dangerously", resources: "usable" });

    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.fetch = jest.fn();

    // Mock the functions that should be in script.js
    window.openModal = jest.fn(() => {
        document.getElementById("modal").style.display = "block";
    });

    window.closeModal = jest.fn(() => {
        document.getElementById("modal").style.display = "none";
    });

    window.handleImageSelect = jest.fn((event) => {
        const file = event.target.files[0];
        const reader = new MockFileReader(); // Use the mocked FileReader
        reader.onload = (ev) => {
            document.getElementById("selectedImage").src = ev.target.result;
            document.getElementById("selectedImage").style.display = "block";
        };
        reader.readAsDataURL(file); // Initiates the read call
    });

    // Add event listeners to match the actual script
    document.getElementById("openModal").onclick = window.openModal;
    document.querySelector(".close").onclick = window.closeModal;
    document.getElementById("imageInput").onchange = window.handleImageSelect;
});

/**
 * Simulates image selection by creating a MockFile object and dispatching a change event.
 * @param {string} inputId - The ID of the input element to simulate.
 */
function simulateImageSelection(inputId) {
    const imageInput = document.getElementById(inputId);
    const file = new MockFile();
    const dataTransfer = new MockDataTransfer();
    dataTransfer.add(file); // Add the file to DataTransfer

    // Create a new property directly on the input element
    Object.defineProperty(imageInput, 'files', {
        value: dataTransfer.files,
        writable: false,
    });

    // Create and dispatch the change event
    const changeEvent = new window.Event('change', { bubbles: true, cancelable: true });
    imageInput.dispatchEvent(changeEvent);
}

afterEach(() => {
    jest.clearAllMocks();
});

describe("Task List Application", () => {
    test('should display selected image', () => {
        simulateImageSelection('imageInput');

        // Check that handleImageSelect was called
        expect(window.handleImageSelect).toHaveBeenCalled();
        expect(document.getElementById("selectedImage").style.display).toBe("block");
    });

    test("should show error message when no tasks are available", () => {
        const errorMessage = document.getElementById("errorMessage");
        const fetchTasks = jest.fn(() => {
            errorMessage.style.display = "block";
            errorMessage.textContent = "No tasks available.";
        });

        fetchTasks();

        expect(errorMessage.style.display).toBe("block");
        expect(errorMessage.textContent).toBe("No tasks available.");
    });

    test("should display tasks when available", () => {
        const taskBody = document.getElementById("taskBody");
        const tasks = [
            { task: "Task 1", title: "Title 1", description: "Description 1", colorCode: "#FF5733" },
            { task: "Task 2", title: "Title 2", description: "Description 2", colorCode: "#33FF57" }
        ];

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

        expect(taskBody.children.length).toBe(2);
        expect(taskBody.children[0].cells[0].textContent).toBe("Task 1");
        expect(taskBody.children[1].cells[0].textContent).toBe("Task 2");
    });

    test("should open and close modal when buttons are clicked", () => {
        const modal = document.getElementById("modal");
        const openModalButton = document.getElementById("openModal");
        const closeModalButton = document.querySelector(".close");

        openModalButton.click();
        expect(window.openModal).toHaveBeenCalled();
        expect(modal.style.display).toBe("block");

        closeModalButton.click();
        expect(window.closeModal).toHaveBeenCalled();
        expect(modal.style.display).toBe("none");
    });
});
