// 1. получите форму из документа по её имени или через document.querySelector
const form = document.forms.myForm;

let name = form.elements.name;
let number = form.elements.phone;
let email = form.elements.email;
let password = form.elements.password;


// 2. установите обработчик события на форму и отследите событие submit
form.addEventListener('submit', async (e) => {

    e.preventDefault();
    const FormData = {
        name: name.value,
        number: number.value,
        email: email.value,
        password: password.value,
    };

    // 4. создайте запрос для отправки данных (метод POST) и отправьте данные формы на сервер
    const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(FormData)
    })

    if (!response.ok) {
        throw new Error(`status ${response.status}`);
    }

    const data = await response.json();
    // 5. вызовите алерт с ответом от сервера
    alert(data.message);
})