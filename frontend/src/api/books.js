import axiosInstance from './axiosInstance'

export async function getBooks(params = {}) {
  const res = await axiosInstance.get('/books', { params })
  return res.data.data
}

export async function getBook(id) {
  const res = await axiosInstance.get(`/books/${id}`)
  return res.data.data
}

export async function createBook(book) {
  const res = await axiosInstance.post('/books', book)
  return res.data.data
}

export async function updateBook(id, book) {
  const res = await axiosInstance.put(`/books/${id}`, book)
  return res.data.data
}

export async function deleteBook(id) {
  await axiosInstance.delete(`/books/${id}`)
}

// Blob download — deliberately NOT unwrapped like the others, since we need the
// raw response (headers, binary body) to drive the browser download/stream.
export async function downloadBook(id) {
  return axiosInstance.get(`/books/${id}/download`, { responseType: 'blob' })
}

export async function getPurchaseStatus(id) {
  const res = await axiosInstance.get(`/books/${id}/purchase-status`)
  return res.data.data // { purchased: true/false }
}


export async function getAdminBook(id) {
  const res = await axiosInstance.get(`/admin/books/${id}`)
  return res.data.data
}