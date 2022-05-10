
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
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}

export async function postCart(obj, quantity = 1) {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}

export async function putCart(obj, quantity) {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}

export async function getProduct(obj) {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}

export async function cartMigrate() {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}

export async function cartCheckout() {
    return axios
      .get('http://13.213.147.47:8080/function/get-products')
      .then(response => (this.info = response))
}