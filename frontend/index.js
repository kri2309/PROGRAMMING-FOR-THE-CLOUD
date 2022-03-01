const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

//Aa1!ajhgdjadh
//The string must contain at least 1 lowercase alphabetical character
//The string must contain at least 1 uppercase alphabetical character
//The string must contain at least 1 numeric character
//The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
//The string must be eight characters or longer
const validatePasswordStrength = (password) => {
  return String(password).match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
  );
};

//Has to be in letters only
const validateNameSurname = (input) => {
  return String(input).match(/^[a-zA-Z]+$/);
};

async function submitLoginInfo() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const url = `http://localhost:3001/login?email=${email}&password=${password}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  if (response.data.result === "success") {
    console.log("Hello " + response.data.name);
  } else {
    console.log("Invalid credentials");
  }
}

async function submitRegisterInfo() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rpassword = document.getElementById("rpassword").value;
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const url = `http://localhost:3001/register?email=${email}&password=${password}&name=${name}&surname=${surname}`;

  //check if email address is in the correct format
  //check if the two passwords match
  if (
    validateEmail(email) &&
    validatePasswordStrength(password) &&
    validateNameSurname(name) &&
    validateNameSurname(surname) &&
    password === rpassword &&
    name !== "" &&
    surname !== "" &&
    password !== ""
  ) {
    const headers = {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
    };
    const response = await axios.post(url, headers);
    if (response.data.result === "success") {
      console.log("Hello " + response.data.name);
    } else {
      console.log("Invalid credentials");
    }
  } else {
    console.log("Invalid fields.");
  }
}