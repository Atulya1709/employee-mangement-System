// // Example after successful login
const handleLogin = async () => {
  const res = await fetch("https://crud.parxfit.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await res.json();

  if (data.token) {
    
    document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;

    
    router.push("/dashboard");
  }
};
