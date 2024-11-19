const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 8080;


let auth_token = "eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMDczMTkyLCJpYXQiOjE3MzE5ODY3OTIsImp0aSI6IjljMzNjY2Y1OTE1OTRjN2Q5ODhhMTkxZTAzODhlYWNjIiwicnV0IjoiMjAxMjM5MzAtNSJ9.K2lPCnuW818BY0MKbdffT_7TWEgOt22853k3BgC8kaA"





app.use(express.json());
app.use(cors(
  {
    origin: '*'
  }
));

const originalUrl = "http://3.217.85.102/api/v1"

function checkTokenMiddleware(req, res, next) {
  if (auth_token) {
    next();
  } else {
    res.status(401).send("No hay token");
  }
}

app.get('/api-proxy/token/', async (req, res) => {
  const url = `${originalUrl}/token/`;
  console.log(url);
  try {
    const response = await axios.post(url, {
      "rut": "20123930-5",
      "password": "@d3Vpr0Tot1no"
    }).
      then(function (response) {
        console.log("prev_tok: ", auth_token);
        auth_token = response.data.access ? response.data.access : auth_token;
        console.log("actual_tok: ", response.data.access);
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
app.get('/api-proxy/publicaciones/', checkTokenMiddleware, async (req, res) => {
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

    )
      .then(function (response) {
        res.json(response.data);
      }
      )
      .catch(function (error) {
        console.log(error);
        res.status(500).send("Error en el proxyy");
      }
      );

  } catch (error) {
    res.status(500).send("Error en el proxy");
  }
});
// categroies etc
app.get('/api-proxy/*', checkTokenMiddleware, async (req, res) => {
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

app.patch('/api-proxy/publicaciones/:id/', async (req, res) => {
  const awsApiUrl = `${originalUrl}/publicaciones/${req.params.id}/`; // URL completa de la API de AWS
  try {
    const response = await axios.patch(awsApiUrl, req.body,
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


app.post('/api-proxy/token/', async (req, res) => {
  const url = `${originalUrl}/token/`;
  console.log(url);
  console.log(req.body)
  axios.post(url, {
    "rut": req.body.rut,
    "password": req.body.password
  }).
    then(function (response) {
      console.log(response.data);
      res.json(response.data);
    }
    )
    .catch(function (error) {
      console.log(error);
      res.status(error.status).send(error.message);
    }
    );

    




});

app.listen(PORT, () => {
  console.log(`Proxy server en el puerto ${PORT}`);
});
