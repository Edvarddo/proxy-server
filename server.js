const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const PORT = process.env.PORT || 8080;
const auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMTc5OTE5LCJpYXQiOjE3MzAwOTM1MTksImp0aSI6Ijg0N2E5ODZjZWRmNTQzNzRhYzdiODU3YzVhODZhYWQyIiwicnV0IjoiMjAxMjM5MzAtNSJ9.32jSP8ORz5LQLe44Yh02pn3F1yUW59ovgc-hIY8J6O0"
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


app.listen(PORT,host="192.168.0.17", () => {
  console.log(`Proxy server en el puerto ${PORT}`);
});
