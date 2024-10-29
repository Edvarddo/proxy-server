const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();


const PORT = process.env.PORT || 8080;
const auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMjU4MjY1LCJpYXQiOjE3MzAxNzE4NjUsImp0aSI6IjYxYjNiN2ExNTFmMTRkZDc4YTc0MjE4NjMwMjRkZTcxIiwicnV0IjoiMjAxMjM5MzAtNSJ9.10FaSb1UjuAgSCJOTF7sfS3Dzec4v06QWVZ7zNhlLmk"
app.use(express.json());
app.use(cors(
  {
    origin: '*'
  }
));
const originalUrl = "http://3.217.85.102/api/v1"


// Configurar el proxy endpoint
app.get('/api-proxy/publicaciones/', async (req, res) => {
  // const awsApiUrl = `http://<tu-api-aws-url>${req.originalUrl.replace('/api-proxy', '')}`;
  console.log(req.originalUrl);
  const awsApiUrl = `${originalUrl}${req.originalUrl.replace('/api-proxy', '')}`;
  console.log(req.originalUrl);
  console.log(awsApiUrl);

  try {
    console.log(awsApiUrl);
    const response = await axios.get(awsApiUrl,
      {
        headers: {
          'Authorization': `Bearer ${auth_token}`
        }
      }

    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error en el proxy");
  }
});
// categroies etc
app.get('/api-proxy/*', async (req, res) => {
  // const awsApiUrl = `http://<tu-api-aws-url>${req.originalUrl.replace('/api-proxy', '')}`;
  console.log(req.originalUrl);
  const awsApiUrl = `${originalUrl}${req.originalUrl.replace('/api-proxy', '')}`;
  console.log(req.originalUrl);
  console.log(awsApiUrl);

  try {
    console.log(awsApiUrl);
    const response = await axios.get(awsApiUrl,
      {
        headers: {
          'Authorization': `Bearer ${auth_token}`
        }
      }

    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error en el proxy");
  }
});

// RETURN DOWNLOAD EXCEL FILE automatic download on client side
// this url will return the excel file http://3.217.85.102/api/v1/export-to-excel/
app.get('/api-proxy/export-to-excel/', async (req, res) => {
  const awsApiUrl = `${originalUrl}/export-to-excel/`; // URL completa de la API de AWS
  
  try {
    // Realizar la solicitud a la API de AWS para obtener el archivo Excel
    const response = await axios.get(awsApiUrl, {
      headers: {
        'Authorization': `Bearer ${auth_token}`
      },
      responseType: 'arraybuffer' // Cambiar a arraybuffer para manejar binarios correctamente
    });
    
    // Configurar los encabezados para forzar la descarga en el navegador
    res.setHeader('Content-Disposition', 'attachment; filename="publicaciones.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', response.data.length); // Establecer el tamaño del contenido

    // Enviar el contenido del archivo al cliente
    res.send(response.data);
    
  } catch (error) {
    console.error("Error en la descarga del archivo:", error.message);
    res.status(500).send("Error en la descarga del archivo");
  }

});



app.listen(PORT, HOST = "192.168.0.10", () => {
  console.log(`Proxy server en el puerto ${PORT}`);
});
