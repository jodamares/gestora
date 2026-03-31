
const getBaseUrl = () => import.meta.env.VITE_API_URL

const URL_BACKEND = `${getBaseUrl()}`

import { request } from './index.js'

export async function createCompany(companyData) {
  const formData = new FormData()
  formData.append('name', companyData.name)
  formData.append('nit', companyData.nit)
  formData.append('city', companyData.city)
  formData.append('department', companyData.department)
  formData.append('phoneNumber', companyData.phoneNumber)
  formData.append('email', companyData.email)
  formData.append('description', companyData.description)
  formData.append('document', companyData.document)

  const response = await fetch(`${URL_BACKEND}companies`, {
    method: 'POST',
    headers: withAuthHeader(),
    body: formData,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const err = new Error(data?.message || `HTTP ${response.status}`)
    err.status = response.status
    throw err
  }
  return data
}

export async function getCompanies() {
  return await request(`${URL_BACKEND}companies`)
}

export function getCompanyDocumentDownloadUrl(companyId) {
  return `${URL_BACKEND}companies/${companyId}/document`
}

export async function getCompanyFolders(companyId) {
  return await request(`${URL_BACKEND}companies/${companyId}/folders`)
}

export async function createCompanyFolder(companyId, payload) {
  return await request(`${URL_BACKEND}companies/${companyId}/folders`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getCompanyFiles(companyId, folderId) {
  const folderQuery = folderId ? `?folderId=${folderId}` : ''
  return await request(`${URL_BACKEND}companies/${companyId}/files${folderQuery}`)
}

export async function uploadCompanyFile(companyId, { folderId, file }) {
  const formData = new FormData()
  if (folderId) formData.append('folderId', String(folderId))
  formData.append('file', file)

  const response = await fetch(`${URL_BACKEND}companies/${companyId}/files`, {
    method: 'POST',
    headers: withAuthHeader(),
    body: formData,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const err = new Error(data?.message || `HTTP ${response.status}`)
    err.status = response.status
    throw err
  }
  return data
}

export function getCompanyFileDownloadUrl(companyId, fileId) {
  return `${URL_BACKEND}companies/${companyId}/files/${fileId}/download`
}

export async function registerUser(payload) {
  return await request(`${URL_BACKEND}auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function loginUser(payload) {
  return await request(`${URL_BACKEND}auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export default {
  createCompany,
  getCompanies,
  getCompanyDocumentDownloadUrl,
  getCompanyFolders,
  createCompanyFolder,
  getCompanyFiles,
  uploadCompanyFile,
  getCompanyFileDownloadUrl,
  registerUser,
  loginUser,
}

function withAuthHeader() {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}