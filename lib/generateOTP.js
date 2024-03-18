// Generate a 6-digit OTP
export function generateOTP() {
  // Initialize a string variable
  let OTP = "";

  // Use for loop to iterate 6 times
  for (let i = 1; i <= 4; i++) {
    // Generate a random number between 1 and 9
    let randomDigit = Math.floor(Math.random() * 9) + 1;

    // Concatenate the random digit to the OTP string
    OTP += randomDigit;
  }

  // Return the 6-digit OTP
  return OTP;
}
