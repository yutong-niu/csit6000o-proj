import axios from "axios"
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
      .get('http://13.213.147.47:8080/function/list-cart')
      .then(response => response)
}

export async function postCart(obj, quantity = 1) {
    return axios
      .post('http://13.213.147.47:8080/function/add-to-cart',{
          "productId": obj.productId,
          "quantity": quantity,
      }
      )
      .then(response => response)
}

export async function putCart(obj, quantity) {
    return axios
      .post('http://13.213.147.47:8080/function/update-cart',{
          "productId": obj.productId,
          "quantity": quantity,
      })
      .then(response => response)
}

export async function getProduct(obj) {
    return axios
      .get('http://13.213.147.47:8080/function/get-product')
      .then(response => response)
}

export async function getProducts(obj) {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => response)
}

export async function cartCheckout() {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => response)
}