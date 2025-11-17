// script.js

// Simple working hash - same everywhere
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = (hash << 5) - hash + password.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString();
}

/* ------------------ SIGNUP ---------------------- */
async function signup() {
    let user = document.getElementById("new-username").value.trim().toLowerCase();
    let pass = document.getElementById("new-password").value;

    if (!user || !pass) {
        alert("Fill in all fields");
        return;
    }

    try {
        console.log("[SIGNUP] Attempting signup for:", user);

        const userRef = db.collection("users").doc(user);
        const docSnap = await userRef.get();

        if (docSnap.exists) {
            alert("Username already exists: " + user);
            console.log("[SIGNUP] Username already exists in Firestore:", user);
            return;
        }

        const hashed = hashPassword(pass);
        console.log("[SIGNUP] Hashed password for", user, "=>", hashed);

        await userRef.set({
            password: hashed,
            appState: {}  // where your checklist/background/etc will go
        });

        alert("Account created for: " + user + ". Please login.");
        console.log("[SIGNUP] Successfully created user document:", user);

        showLogin();
    } catch (err) {
        console.error("[SIGNUP] Error:", err);
        alert("Error creating account. Check console.");
    }
}

/* ------------------ LOGIN ---------------------- */
async function login() {
    let user = document.getElementById("username").value.trim().toLowerCase();
    let pass = document.getElementById("password").value;

    if (!user || !pass) {
        alert("Fill in all fields");
        return;
    }

    try {
        console.log("[LOGIN] Attempting login for:", user);

        const userRef = db.collection("users").doc(user);
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            alert("User not found in Firestore: " + user);
            console.log("[LOGIN] No such user document:", user);
            return;
        }

        const data = docSnap.data();
        const storedPassword = data.password;
        const hashed = hashPassword(pass);

        console.log("[LOGIN] Stored hash:", storedPassword);
        console.log("[LOGIN] Input hash :", hashed);

        if (storedPassword !== hashed) {
            alert("Password incorrect for user: " + user);
            console.log("[LOGIN] Password mismatch for user:", user);
            return;
        }

        // success
        console.log("[LOGIN] Login successful for:", user);
        localStorage.setItem("currentUser", user);
        window.location.href = "index.html";
    } catch (err) {
        console.error("[LOGIN] Error:", err);
        alert("Error logging in. Check console.");
    }
}

/* ------------------ FORM SWITCHING ---------------------- */

function showSignup() {
    document.getElementById("signup").style.display = "block";
    document.getElementById("username").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.querySelector('button[onclick="login()"]').style.display = "none";
    document.querySelector('.login-box > p').style.display = "none";
}

function showLogin() {
    document.getElementById("signup").style.display = "none";
    document.getElementById("username").style.display = "block";
    document.getElementById("password").style.display = "block";
    document.querySelector('button[onclick="login()"]').style.display = "block";
    document.querySelector('.login-box > p').style.display = "block";
}

// Optional: enter key handling
document.addEventListener("DOMContentLoaded", () => {
    const u = document.getElementById("username");
    const p = document.getElementById("password");
    if (u) {
        u.addEventListener("keypress", e => {
            if (e.key === "Enter") p.focus();
        });
    }
    if (p) {
        p.addEventListener("keypress", e => {
            if (e.key === "Enter") login();
        });
    }
});
