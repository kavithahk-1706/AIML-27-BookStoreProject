import axiosInstance from './axiosInstance'

export async function getCategories() {
  const res = await axiosInstance.get('/categories')
  return res.data.data
}

export async function createCategory(category) {
  const res = await axiosInstance.post('/categories', category)
  return res.data.data
}