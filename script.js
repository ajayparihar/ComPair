// File Name: script.js
// Description: This file contains the JavaScript logic for the ComPair tool,
//              handling file uploads, reading file contents, comparing the
//              contents line by line, and displaying the differences.
// Author: Ajay Singh
// Version: 1.0
// Date: 23-10-2024

// Constants for element selectors and configurations
const FILE1_INPUT_ID = "file1";
const FILE2_INPUT_ID = "file2";
const COMPARE_BTN_ID = "compareBtn";
const FILE_NAMES_DIV_ID = "fileNames";
const RESULT_DIV_ID = "result";

// Element references
const file1Input = document.getElementById(FILE1_INPUT_ID);
const file2Input = document.getElementById(FILE2_INPUT_ID);
const compareBtn = document.getElementById(COMPARE_BTN_ID);
const fileNamesDiv = document.getElementById(FILE_NAMES_DIV_ID);
const resultDiv = document.getElementById(RESULT_DIV_ID);

// Add event listener for the compare button
compareBtn.addEventListener("click", handleFileComparison);

/**
 * Handles the file comparison process.
 */
function handleFileComparison() {
    if (!validateFileInputs()) {
        alert("Please select both files.");
        return;
    }

    const file1 = file1Input.files[0];
    const file2 = file2Input.files[0];
    displayFileNames(file1.name, file2.name);
    
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = (event1) => {
        const text1 = event1.target.result;
        reader2.onload = (event2) => {
            const text2 = event2.target.result;
            displayComparison(text1, text2);
        };
        reader2.readAsText(file2);
    };

    reader1.readAsText(file1);
}

/**
 * Validates if both file inputs are selected.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateFileInputs() {
    return file1Input.files.length > 0 && file2Input.files.length > 0;
}

/**
 * Displays the names of the files being compared.
 * @param {string} fileName1 - Name of the first file.
 * @param {string} fileName2 - Name of the second file.
 */
function displayFileNames(fileName1, fileName2) {
    fileNamesDiv.innerHTML = `${fileName1} - ${fileName2}`;
}

/**
 * Displays the comparison result in the result div.
 * @param {string} text1 - Content of the first file.
 * @param {string} text2 - Content of the second file.
 */
function displayComparison(text1, text2) {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLength = Math.max(lines1.length, lines2.length);
    resultDiv.innerHTML = ""; // Clear previous results

    for (let i = 0; i < maxLength; i++) {
        const line1 = lines1[i] || ""; // Get line or empty string
        const line2 = lines2[i] || ""; // Get line or empty string

        const lineDiv = createLineComparisonDiv(i, line1, line2);
        resultDiv.appendChild(lineDiv);
    }
}

/**
 * Creates a line comparison div containing line numbers and content.
 * @param {number} index - Line index.
 * @param {string} line1 - Content of the first line.
 * @param {string} line2 - Content of the second line.
 * @returns {HTMLElement} The line comparison div.
 */
function createLineComparisonDiv(index, line1, line2) {
    const lineDiv = document.createElement("div");
    lineDiv.classList.add("line");

    const lineNumber1 = createLineNumberDiv(index);
    const lineNumber2 = createLineNumberDiv(index);

    const highlightedLine1 = highlightDifferences(line1, line2);
    const highlightedLine2 = highlightDifferences(line2, line1);

    const line1Div = createLineDiv("line1", highlightedLine1); // File 1 content
    const line2Div = createLineDiv("line2", highlightedLine2); // File 2 content

    // Swap append order to place file 1 on the right side
    lineDiv.append(lineNumber2, line2Div, lineNumber1, line1Div);
    return lineDiv;
}


/**
 * Creates a line number div.
 * @param {number} index - Line index.
 * @returns {HTMLElement} The line number div.
 */
function createLineNumberDiv(index) {
    const lineNumberDiv = document.createElement("div");
    lineNumberDiv.classList.add("line-number");
    lineNumberDiv.textContent = index + 1; // Line numbers start from 1
    return lineNumberDiv;
}

/**
 * Creates a line content div.
 * @param {string} className - Class name for the div.
 * @param {string} content - Content to display.
 * @returns {HTMLElement} The line content div.
 */
function createLineDiv(className, content) {
    const lineDiv = document.createElement("div");
    lineDiv.classList.add(className);
    lineDiv.innerHTML = content;
    return lineDiv;
}

/**
 * Highlights differences between two lines of text.
 * @param {string} line - The line to compare.
 * @param {string} compareLine - The line to compare against.
 * @returns {string} The line with highlighted differences.
 */
function highlightDifferences(line, compareLine) {
    if (line === compareLine) {
        return line; // Return the original line if there are no differences
    }

    const words1 = line.split(" ");
    const words2 = compareLine.split(" ");
    let highlightedContent = '';

    const maxWordsLength = Math.max(words1.length, words2.length);
    for (let i = 0; i < maxWordsLength; i++) {
        const word1 = words1[i] || ""; // Get word or empty string
        const word2 = words2[i] || ""; // Get word or empty string

        highlightedContent += (word1 !== word2) 
            ? `<span class="changed">${word1}</span> ` 
            : `${word1} `;
    }

    return highlightedContent.trim(); // Trim any trailing space
}
