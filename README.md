# Diabetes Risk App

Aplicacion movil desarrollada con Expo y React Native para estimar de forma referencial el riesgo de diabetes a partir de indicadores clinicos basicos. La app consume un backend FastAPI que ejecuta un modelo de Machine Learning y guarda el historial de predicciones.

> Esta aplicacion no reemplaza una evaluacion medica profesional. Su objetivo es educativo, preventivo y academico.

## Caracteristicas

- Flujo guiado por pasos para ingresar datos.
- Validacion local de rangos antes de consultar el backend.
- Prediccion de riesgo usando API FastAPI.
- Pantalla dedicada de resultado con porcentaje estimado, nivel de riesgo y recomendaciones.
- Historial de predicciones registradas.
- Interfaz moderna con soporte para modo claro y oscuro.
- Navegacion por tabs y gesto horizontal entre pantallas.

## Tecnologias

- Expo
- React Native
- TypeScript
- Expo Router
- Axios
- Material Icons

## Pantallas principales

| Pantalla | Descripcion |
| --- | --- |
| Prediccion | Formulario guiado para ingresar edad, glucosa, BMI y otros indicadores. |
| Historial | Lista las ultimas predicciones guardadas por el backend. |
| Resultado | Muestra el resultado final, porcentaje de riesgo, estado visual y recomendaciones. |

## Requisitos

- Node.js
- npm
- Expo Go en Android o iOS
- Backend FastAPI ejecutandose en la misma red local

## Instalacion

```bash
npm install
```

## Configuracion de la API

Crea un archivo `.env` en la raiz del proyecto:

```env
EXPO_PUBLIC_API_BASE_URL=http://TU_IP_LOCAL:8000
```

Ejemplo:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.18.2:8000
```

Si usas Android con Expo Go, no uses `localhost`, porque el telefono interpretara `localhost` como el propio dispositivo. Debes usar la IP local de la computadora donde corre FastAPI.

## Ejecutar en Expo Go

```bash
npx expo start --host lan
```

Luego escanea el QR con Expo Go.

Si Expo no toma cambios recientes:

```bash
npx expo start --host lan -c
```

## Backend esperado

La app espera que el backend exponga estos endpoints:

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/health` | Verificar estado de API, modelo y base de datos. |
| `POST` | `/predict` | Enviar indicadores y recibir prediccion. |
| `GET` | `/predictions?limit=20` | Obtener historial de predicciones. |

Respuesta esperada de `/predict`:

```json
{
  "id": 1,
  "prediction": 1,
  "risk": "alto",
  "message": "Alto riesgo de diabetes",
  "recommendation": "Consulta con un profesional de salud para una evaluacion preventiva."
}
```

## Datos solicitados

- Embarazos
- Edad
- Glucosa
- Presion arterial
- BMI / IMC
- Grosor de piel
- Insulina
- Funcion pedigree de diabetes

## Problemas comunes

| Problema | Solucion |
| --- | --- |
| Expo Go no conecta al proyecto | Verifica que celular y PC esten en la misma red. |
| La app no conecta con FastAPI | Usa la IP local de la PC en `EXPO_PUBLIC_API_BASE_URL`. |
| En Linux no conecta desde el celular | Abre puertos: `sudo ufw allow 8081/tcp` y `sudo ufw allow 8000/tcp`. |
| Cambiaste `.env` y sigue igual | Reinicia Expo con `npx expo start --host lan -c`. |

## Scripts disponibles

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Nota academica

Este proyecto forma parte de una solucion movil academica para Taller de Software Movil. La prediccion es referencial y debe interpretarse como orientacion preventiva, no como diagnostico clinico.
