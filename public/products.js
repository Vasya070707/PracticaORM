const productForm = document.forms.productForm;
const productsTable = document.getElementById('productsTable');
const formMessage = document.getElementById('formMessage');

function displayProducts(products) {
    if (products.length === 0) {
        productsTable.innerHTML = '<p>Товары не найдены</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID товара</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Описание</th>
                </tr>
            </thead>
            <tbody>
    `;

    products.forEach(product => {
        tableHTML += `
            <tr>
                <td class="product-id">${product.productID}</td>
                <td>${product.productName}</td>
                <td class="product-price">${parseFloat(product.productPrice).toFixed(2)} ₽</td>
                <td>${product.productDescription || '-'}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    productsTable.innerHTML = tableHTML;
}

async function loadProducts() {
    try {
        const response = await fetch('/getProducts');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке товаров');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка:', error);
        productsTable.innerHTML = `<div class="error">Ошибка загрузки товаров: ${error.message}</div>`;
    }
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.innerHTML = '';

    const productData = {
        productName: productForm.elements.productName.value.trim(),
        productPrice: parseFloat(productForm.elements.productPrice.value),
        productDescription: productForm.elements.productDescription.value.trim()
    };

    if (!productData.productName || isNaN(productData.productPrice) || productData.productPrice < 0) {
        formMessage.innerHTML = '<div class="error">Пожалуйста, заполните все обязательные поля корректно</div>';
        return;
    }

    try {
        const response = await fetch('/postProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.ok) {
            productForm.reset();
            loadProducts();
        } else {
            formMessage.innerHTML = `<div class="error">Ошибка: ${data.error || 'Не удалось добавить товар'}</div>`;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        formMessage.innerHTML = `<div class="error">Ошибка при добавлении товара: ${error.message}</div>`;
    }
});

loadProducts();

