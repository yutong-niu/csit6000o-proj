import axios from "axios"
import { url } from "vuelidate/lib/validators"
//
// async function getHeaders(includeAuth) {
//     const headers = {
//         "Content-Type": "application/json"
//     }
//
//     if (!includeAuth) {
//         return {
//             "Content-Type": "application/json"
//         }
//     }
//     let session = null
//     try {
//         session = await Auth.currentSession()
//     } catch (e) {
//         e == e
//     }
//     if (session) {
//         let authheader = session.getIdToken().jwtToken
//         headers['Authorization'] = authheader
//     }
//     return headers
// }

export async function getCart() {
  return axios
    .get('/api/list-cart')
    .then(response => response)
}

export async function postCart(obj, quantity = 1) {
  return axios
    .post('/api/add-to-cart',
      {
        "productId": obj.productId,
        "quantity": quantity,
      }
    )
    .then(response => response)
}

export async function putCart(obj, quantity) {
  return axios
    .post('/api/update-cart', {
      "productId": obj.productId,
      "quantity": quantity,
    })
    .then(response => response)
}

// export async function getProduct(obj) {
//   return axios
//     .get('/get-product')
//     .then(response => response)
// }

export async function getProducts() {
  return axios
    .get('/api/get-products')
    .then(response => response)
}

export async function cartCheckout() {
  return axios
    .get('/api/checkout-cart')
    .then(response => response)
}