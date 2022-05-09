print('Start #################################################################');
db.auth('admin-user', 'admin-password')
db.createUser({
    user: 'csit6000o',
    pwd: 'csit6000o',
    roles: ["root"],
});

db = db.getSiblingDB("cart")


db.items.insert({
    pk: "user@test",
    sk: "product@test",
    quantity: 100,
    expirationTime: 10,
    productDetail: {
        name: "xxx",
        price: 29
    }
})
print('END #################################################################');
