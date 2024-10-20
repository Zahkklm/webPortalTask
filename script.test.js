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
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById("selectedImage").src = ev.target.result;
            document.getElementById("selectedImage").style.display = "block";
        };
        reader.readAsDataURL(file);
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
    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', true, true);
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
});
