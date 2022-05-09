const nearbyStore = location => {
    let res = {}
    return new Promise((resolve, reject) => {
        let res = [
            {id: 0, name: "数停车 (城发天地)", address: "古运路196号", location: {latitude: 30.304157, longitude: 120.130155}, phone: "18367590702", openTime: "09:00 ~ 22:00", status: 'OPENING', distance: '1.3km'}, 
        ]
        if (res) {
            return resolve(res);
        } else {
            return reject("create obj failed");
        }
    })
}

export default {
    nearbyStore
}