document.getElementById('cv_ai').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    
    try {
        const response = await fetch('http://localhost:9000/api/aicv/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();

        console.log(data);
        alert('CV enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el CV:', error);
        alert('Hubo un error al enviar el CV');
    }
});