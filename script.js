document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    document.getElementById('uploadForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Form submitted');

        const folderInput = document.getElementById('folderInput');
        const files = folderInput.files;
        console.log('Files selected:', files);

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i], files[i].webkitRelativePath);
        }

        try {
            const response = await fetch('http://127.0.0.1:53448/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Result from backend:', result);
            displayResult(result);
        } catch (error) {
            console.error('Error uploading folder:', error);
            document.getElementById('result').innerHTML = `<p style="color: red;">Error uploading folder: ${error.message}</p>`;
        }
    });
});

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (result.error) {
        resultDiv.innerHTML = `<p style="color: red;">${result.error}</p>`;
        return;
    }

    console.log('Displaying result:', result);

    const table = document.createElement('table');
    table.classList.add('result-table');

    const index = Object.keys(result['InsoleLength'])[0];
    const headers = Object.keys(result);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const row = document.createElement('tr');
    headers.forEach(header => {
        const td = document.createElement('td');
        if (header === '3D Foot Scan' || header === 'Insole Screenshot') {
            const images = result[header][index].split('|');
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = image;
                img.width = 100;
                td.appendChild(img);
            });
        } else {
            td.textContent = result[header][index];
        }
        row.appendChild(td);
    });
    table.appendChild(row);

    resultDiv.appendChild(table);
}