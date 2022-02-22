
document.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit button pressed");
    submitLoginInformation();
  });

  async function submitLoginInformation(e){
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const url = "http://localhost:3001/login?email=" + email + "&password=" + password;

      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": true,
        };

      const respone = await axios.post(url , headers);
      console.log(respone);
    

  }