/**
 * Student Registration System
 * Core JavaScript functionality for managing student records
 */

// Initialize students array from localStorage or empty array if none exists
let students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = -1; // Track which student is being edited (-1 means none)

// DOM Elements
const btn = document.querySelector(".form-submit");
const studentTableBody = document.querySelector("#studentTableBody");

/**
 * Validates form input fields
 * @returns {boolean} True if validation passes, false otherwise
 */
const validateForm = () => {
  const student_id = document.getElementById("studentId").value.trim();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();

  // Check for empty fields
  if (!student_id || !name || !email || !contact) {
    alert("All fields are required!");
    return false;
  }

  // Validate student ID (numbers only)
  if (!/^\d+$/.test(student_id)) {
    alert("Student ID must contain only numbers");
    return false;
  }

  // Validate name (letters only)
  if (!/^[A-Za-z\s]+$/.test(name)) {
    alert("Name must contain only letters");
    return false;
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  // Validate contact (numbers only)
  if (!/^\d+$/.test(contact)) {
    alert("Contact must contain only numbers");
    return false;
  }

  return true;
};

/**
 * Capitalizes first letter of each word in a string
 * @param {string} str - The input string
 * @returns {string} The formatted string
 */
const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Renders the student table with current data
 * Handles both empty state and populated records
 */
const renderStudents = () => {
  studentTableBody.innerHTML = "";

  if (students.length === 0) {
    // Show no records message if array is empty in localStorage
    studentTableBody.innerHTML = `
            <tr class="text-center tr-no-records">
                <td colspan="5" class="py-4 text-gray-500">No records found</td>
            </tr>
        `;
    return;
  }

  // Render students if array is not empty
  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-purple-50";
    tr.innerHTML = `
            <td class="px-6 py-4">
                <span class="text-sm text-gray-900">${capitalizeWords(
                student.name
                )}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-900">${student.id}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-900">${student.email}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-900">${student.contact}</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button onclick="editStudent(${index})" 
                        class="inline-flex items-center px-3 py-1.5 text-sm text-white bg-purple-600 rounded hover:bg-purple-700">
                        <i class="fas fa-edit mr-1"></i> 
                    </button>
                    <button onclick="deleteStudent(${index})" 
                        class="inline-flex items-center px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                        <i class="fas fa-trash mr-1"></i>
                    </button>
                </div>
            </td>
        `;
    studentTableBody.appendChild(tr);
  });
};

/**
 * Resets form to initial state
 * Clears inputs and resets button styling
 */
const resetForm = () => {
  document.querySelector("form").reset();
  btn.textContent = "Register Student";
  btn.classList.remove(
    "from-green-600",
    "to-teal-600",
    "hover:from-green-700",
    "hover:to-teal-700"
  );
  btn.classList.add(
    "from-blue-600",
    "to-indigo-600",
    "hover:from-blue-700",
    "hover:to-indigo-700"
  );
  editingIndex = -1;// Reset editing index
};

// Add/Update student
btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const student = {
    id: document.getElementById("studentId").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    contact: document.getElementById("contact").value.trim(),
  };

  if (editingIndex >= 0) {
    // Update existing student
    students[editingIndex] = student;
  } else {
    // Add new student
    students.push(student);
  }

  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  resetForm();
});

// Edit student
window.editStudent = (index) => {
  const student = students[index];
  document.getElementById("studentId").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  editingIndex = index; // Store the editing index

  // Change button text and style
  btn.textContent = "Update Student";
  btn.classList.remove(
    "from-blue-600",
    "to-indigo-600",
    "hover:from-blue-700",
    "hover:to-indigo-700"
  );
  btn.classList.add(
    "from-green-600",
    "to-teal-600",
    "hover:from-green-700",
    "hover:to-teal-700"
  );
};

// Delete student
window.deleteStudent = (index) => {
  if (editingIndex === index) {
    resetForm();
  }

  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
};

// Initial render
renderStudents();
