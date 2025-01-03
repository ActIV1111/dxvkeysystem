// Function to generate a random alphanumeric string of a given length
function generateRandomPart(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

// Function to generate the full random key
function generateKey() {
    const prefix = "Dxv-"; // Fixed prefix
    const part1 = generateRandomPart(5);  // 5 characters
    const part2 = generateRandomPart(5);  // 5 characters
    const part3 = generateRandomPart(5);  // 5 characters
    const part4 = generateRandomPart(4);  // 4 characters (final part)

    return `${prefix}${part1}-${part2}-${part3}-${part4}`;
}

// Function to handle the key generation process
function handleKeyGeneration() {
    const currentTime = Date.now(); // Current timestamp (in milliseconds)

    // Check if key generation is allowed (5 hours cooldown)
    const lastGeneratedTime = localStorage.getItem("lastGeneratedTime");
    const keyExpirationTime = localStorage.getItem("keyExpirationTime");
    const generatedKey = localStorage.getItem("generatedKey");

    if (!lastGeneratedTime || currentTime - lastGeneratedTime >= 5 * 60 * 60 * 1000) {
        // Allow key generation if it's been at least 5 hours since the last one
        if (!generatedKey || currentTime > keyExpirationTime) {
            const newKey = generateKey();
            const keyExpiryTime = currentTime + 24 * 60 * 60 * 1000; // Set the key to expire in 24 hours

            // Store the key and timestamps
            localStorage.setItem("generatedKey", newKey);
            localStorage.setItem("lastGeneratedTime", currentTime);
            localStorage.setItem("keyExpirationTime", keyExpiryTime);
            localStorage.setItem("keyUsed", false); // Initially the key has not been used

            // Display the generated key and expiration info
            document.getElementById("key").innerText = newKey;
            document.getElementById("message").innerText = "This is a one-way key. It will expire in 24 hours.";
        } else {
            // If the key is already generated but expired, allow regeneration
            document.getElementById("key").innerText = "Your previous key has expired. Please try again in 5 hours.";
            document.getElementById("message").innerText = "This will not work.";
        }
    } else {
        // If not allowed to generate a key yet, show the previous key with a message
        if (generatedKey) {
            document.getElementById("key").innerText = generatedKey;
            document.getElementById("message").innerText = "This will not work.";
        }
    }
}

// Function to check if the key is expired or used
function checkKeyValidity() {
    const currentTime = Date.now();
    const keyExpirationTime = localStorage.getItem("keyExpirationTime");
    const keyUsed = localStorage.getItem("keyUsed");

    if (currentTime > keyExpirationTime) {
        // If the key has expired
        localStorage.removeItem("generatedKey");
        localStorage.removeItem("keyExpirationTime");
        localStorage.removeItem("keyUsed");
        document.getElementById("key").innerText = "Your key has expired.";
        document.getElementById("message").innerText = "This will not work.";
    } else if (keyUsed === "true") {
        // If the key has already been used
        document.getElementById("key").innerText = "This key has already been used.";
        document.getElementById("message").innerText = "This will not work.";
    }
}

// Call the function to handle key generation
handleKeyGeneration();

// Check the key validity every time the page loads
checkKeyValidity();
