const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 8080;
let auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNjc3NDU2LCJpYXQiOjE3MzA1OTEwNTYsImp0aSI6IjkxYzRjN2UwNGE4ZjQ5NGVhYzkyZTAzMzMyYmJlY2JiIiwicnV0IjoiMjAxMjM5MzAtNSJ9.BwPEOrK4ronwERUKM5PpJ4qHeUQld2bRMTTRsTIR-74"

function getToken() {
  const url =  `${originalUrl}/token/`;
  console.log(url);
  axios.post( url, {
    "rut": "20123930-5",
    "password": "@d3Vpr0Tot1no"
  })
    .then(function (response) {
      // console.log(response.data.access);
      console.log("token saved");
      auth_token = response.data.access;
    }
    )
    .catch(function (error) {
      console.log(error);
    }
    );
}
// every 10 seconds for testing
// for 
// setInterval(getToken, 1000 * 10); // Cada 10 segundos
setInterval(getToken, 1000 * 60 * 60 * 24); // Cada 24 horas





app.use(express.json());
app.use(cors(
  {
    origin: '*'
  }
));

const originalUrl = "http://3.217.85.102/api/v1"
// getToken();

// get token and save endpoint
app.get('/api-proxy/token/', async (req, res) => {
  const url = `${originalUrl}/token/`;
  console.log(url);
  try {
    const response = await axios.post(url, {
      "rut": "20123930-5",
      "password": "@d3Vpr0Tot1no"
    }).
      then(function (response) {
        console.log("prev_tok: ",auth_token);
        auth_token = response.data.access ? response.data.access : auth_token;
        console.log("actual_tok: ",response.data.access);
        res.json(response.data);
      }
      )
      .catch(function (error) {
        console.log(error);
      }
      );
    
     
  } catch (error) {
    res.status(500).send("Error en el proxy");
  }
});

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



app.listen(PORT, HOST = "192.168.0.11", () => {
  console.log(`Proxy server en el puerto ${PORT}`);
});
