import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'token'

const MESSAGE_SERVEUR_INJOIGNABLE =
  'Le serveur est injoignable. Veuillez réessayer dans quelques instants.'
const MESSAGE_ERREUR_INCONNUE = 'Une erreur inattendue est survenue.'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

function ajouterToken(config) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

function creerErreurApi(error) {
  if (error.response) {
    const { status, data } = error.response
    const apiError = new Error(data?.error?.message ?? MESSAGE_ERREUR_INCONNUE)
    apiError.status = data?.error?.status ?? status
    return apiError
  }

  if (error.request) {
    return new Error(MESSAGE_SERVEUR_INJOIGNABLE)
  }

  return new Error(MESSAGE_ERREUR_INCONNUE)
}

function normaliserErreur(error) {
  if (axios.isCancel(error)) {
    return Promise.reject(error)
  }
  return Promise.reject(creerErreurApi(error))
}

axiosClient.interceptors.request.use(ajouterToken)
axiosClient.interceptors.response.use((response) => response, normaliserErreur)

export default axiosClient
