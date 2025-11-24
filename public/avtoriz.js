const avtoriz = document.forms.myLog;

avtoriz.addEventListener('submit', async (e) => {
  e.preventDefault();

  const Login = {
    email: avtoriz.elements.email.value.trim(), 
    password: avtoriz.elements.MyPassword.value.trim(),
  };

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Login)
  });

  const data = await response.json();

  if (response.ok && data.active) {
    localStorage.setItem('user', JSON.stringify(data.userData));
    window.location.href = `profil.html?userId=${data.userData.userId}`;
  } else {
    alert(data.message || 'Ошибка входа');
  }
});
