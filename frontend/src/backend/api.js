import {
    Auth,
    API
} from 'aws-amplify'

async function getHeaders(includeAuth) {
    const headers = {
        "Content-Type": "application/json"
    }

    if (!includeAuth) {
        return {
            "Content-Type": "application/json"
        }
    }
    let session = null
    try {
        session = await Auth.currentSession()
    } catch (e) {
        e == e
    }
    if (session) {
        let authheader = session.getIdToken().jwtToken
        headers['Authorization'] = authheader
    }
    return headers
}

export async function getCart() {
    return getHeaders(true).then(
        headers => API.get("CartAPI", "/function/list-cart", {
            headers: headers,
            withCredentials: true
        }))
}

export async function postCart(obj, quantity = 1) {
    return getHeaders(true).then(
        headers => API.post("CartAPI", "/function/add-to-cart" + obj.productId, {
            body: {
                productId: obj.productId,
                quantity: quantity,
            },
            headers: headers,
            withCredentials: true
        })
    )
}

export async function putCart(obj, quantity) {
    return getHeaders(true).then(
        headers => API.put("CartAPI", "function/add-to-cart/" + obj.productId, {
            body: {
                productId: obj.productId,
                quantity: quantity,
            },
            headers: headers,
            withCredentials: true
        })
    )
}

export async function getProduct(obj) {
    return getHeaders().then(
        headers => API.put("ProductAPI", "/function/get-product" + obj.productId, {
            body: {
                productId: obj.productId,
            },
            headers: headers,
        })
    )
}

export async function cartMigrate() {
    return getHeaders(true).then(
        headers => API.post("CartAPI", "function/migrate-cart", {
            headers: headers,
            withCredentials: true
        })
    )
}

export async function cartCheckout() {
    return getHeaders(true).then(
        headers => API.post("CartAPI", "function/checkout-cart", {
            headers: headers,
            withCredentials: true
        })
    )
}