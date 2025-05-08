// Shared state
let users = {
    parents: [],
    teachers: [],
    students: []
};

let currentUser = null;
let currentUserType = null;
let studentData = { age: null, grade: null };
let assessmentResponses = { reading: [], writing: [], math: [] };

// Notification function
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.classList.remove('hidden', 'error');
    if (isError) notification.classList.add('error');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}

// Validation
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePassword(password) { return password.length >= 6; }

// Login page logic for all user types
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.login-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    ['parent', 'teacher', 'student'].forEach(type => {
        const loginForm = document.getElementById(`${type}-login-form`);
        const registerForm = document.getElementById(`${type}-register-form`);
        const registerLink = document.getElementById(`${type}-register-link`);
        const loginLink = document.getElementById(`${type}-login-link`);

        if (registerLink && loginLink && loginForm && registerForm) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            });

            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            });

            registerForm.addEventListener('submit', e => {
                e.preventDefault();
                const name = document.getElementById(`${type}-name-register`).value;
                const email = document.getElementById(`${type}-email-register`).value;
                const password = document.getElementById(`${type}-password-register`).value;
                const emailError = document.getElementById(`${type}-email-error-register`);
                const passwordError = document.getElementById(`${type}-password-error-register`);

                emailError.style.display = validateEmail(email) ? 'none' : 'block';
                passwordError.style.display = validatePassword(password) ? 'none' : 'block';
                if (!validateEmail(email) || !validatePassword(password)) return;

                if (users[`${type}s`].some(u => u.email === email)) {
                    showNotification('Email already registered', true);
                    return;
                }

                users[`${type}s`].push({ id: `${type[0]}${users[`${type}s`].length + 1}`, name, email, password });
                showNotification('Registration successful! Please log in.');
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            });

            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                const email = document.getElementById(`${type}-email`).value;
                const password = document.getElementById(`${type}-password`).value;
                const emailError = document.getElementById(`${type}-email-error`);
                const passwordError = document.getElementById(`${type}-password-error`);

                emailError.style.display = validateEmail(email) ? 'none' : 'block';
                passwordError.style.display = validatePassword(password) ? 'none' : 'block';
                if (!validateEmail(email) || !validatePassword(password)) return;

                const user = users[`${type}s`].find(u => u.email === email && u.password === password);
                if (user) {
                    currentUser = user;
                    currentUserType = type;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('currentUserType', type);
                    showNotification(`Welcome, ${user.name}!`);
                    window.location.href = type === 'student' ? 'quiz.html' : 'select-student.html';
                } else {
                    showNotification('Invalid credentials', true);
                }
            });
        }
    });
});

// Select student page logic
if (document.getElementById('start-assessment')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.getItem('currentUser')) {
            showNotification('Please log in first', true);
            setTimeout(() => window.location.href = 'index.html', 1000);
            return;
        }
        document.getElementById('student-form').addEventListener('submit', e => {
            e.preventDefault();
            const age = document.getElementById('child-age').value;
            const grade = document.getElementById('child-grade').value;
            if (!age || !grade) {
                showNotification('Please select age and grade', true);
                return;
            }
            studentData = { age, grade };
            localStorage.setItem('studentData', JSON.stringify(studentData));
            window.location.href = 'assessment.html';
        });
    });
}

// Shared student info page logic
document.addEventListener('DOMContentLoaded', () => {
    const studentInfoForm = document.getElementById('student-info-form');
    const studentForm = document.getElementById('student-form');

    if (studentInfoForm) {
        studentInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const studentName = document.getElementById('student-name').value.trim();
            const studentAge = document.getElementById('student-age').value.trim();
            const parentTeacherName = document.getElementById('parent-teacher-name').value.trim();
            const role = document.getElementById('role').value;

            if (!studentName || !studentAge || !parentTeacherName || !role) {
                showNotification('Please fill in all fields.', true);
                return;
            }

            const userData = { name: parentTeacherName, role };
            const studentData = { name: studentName, age: studentAge, grade: null };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('studentData', JSON.stringify(studentData));
            window.location.href = 'select-student.html';
        });
    }

    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const grade = document.getElementById('child-grade').value;
            if (!grade) {
                showNotification('Please select a grade.', true);
                return;
            }
            const studentData = JSON.parse(localStorage.getItem('studentData'));
            studentData.grade = grade;
            localStorage.setItem('studentData', JSON.stringify(studentData));
            window.location.href = 'assessment.html';
        });
    }
});
