import axios from "axios";

const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

type ApiErrorInfo = {
  title: string;
  message: string;
};

type FastApiValidationError = {
  detail?: Array<{
    loc?: Array<string | number>;
    msg?: string;
  }>;
  message?: string;
};

function getValidationMessage(data: FastApiValidationError) {
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    return data.detail
      .map((item) => {
        const field = item.loc?.at(-1);
        return field && item.msg ? `${field}: ${item.msg}` : item.msg;
      })
      .filter(Boolean)
      .join("\n");
  }

  return data.message;
}

export function getApiErrorInfo(error: unknown): ApiErrorInfo {
  if (!axios.isAxiosError<FastApiValidationError>(error)) {
    return {
      title: "Error inesperado",
      message: "Ocurrio un problema inesperado. Intenta nuevamente.",
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      title: "Tiempo de espera agotado",
      message: "La API tardo demasiado en responder. Verifica la conexion e intenta otra vez.",
    };
  }

  if (!error.response) {
    return {
      title: "Sin conexion con la API",
      message: `No se pudo conectar con ${API_BASE_URL}. Verifica que FastAPI este ejecutandose y que la URL sea correcta.`,
    };
  }

  if (error.response.status === 422) {
    return {
      title: "Datos no validos",
      message:
        getValidationMessage(error.response.data) ??
        "La API rechazo los datos enviados. Revisa los valores ingresados.",
    };
  }

  if (error.response.status >= 500) {
    return {
      title: "Error del servidor",
      message: "La API tuvo un problema interno. Revisa la terminal del backend.",
    };
  }

  return {
    title: "Error de API",
    message:
      getValidationMessage(error.response.data) ??
      `La API respondio con estado ${error.response.status}.`,
  };
}
