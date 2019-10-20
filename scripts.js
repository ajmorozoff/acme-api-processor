

//time: O(n)
const findProductsInPriceRange = (productList, range) => {
    //O(n)
    return productList.filter(prod => prod.suggestedPrice >= range.min && prod.suggestedPrice <= range.max);
}

//time: O(n)
const groupCompaniesByLetter = (companyList) => {
    let obj = {};
    //O(n)
    companyList.forEach(company => {
        let letter = company.name.slice(0, 1).toUpperCase();
        //obj will have a maximum length of 26
        if (obj.hasOwnProperty(letter)) {
            obj[letter].push(company);
        }
        else {
            obj[letter] = [company];
        }
    })
    return obj;
}

//time: O(n)
const groupCompaniesByState = (companyList) => {
    let obj = {};
    //O(n)
    companyList.forEach(company => {
        let state = company.state;
        //obj will have a maximum length of 50
        if (obj.hasOwnProperty(state)) {
            obj[state].push(company);
        }
        else {
            obj[state] = [company];
        }
    })
    return obj;
}

//time: O(n^2)
const processOfferings = (obj) => {
    let arr = [];
    //O(n)
    obj.offerings.forEach(offer => {
        //O(n)
        offer.company = obj.companies.filter(company => company.id === offer.companyId)[0];
        //O(n)
        offer.product = obj.products.filter(prod => prod.id === offer.productId)[0];
        arr.push(offer);
    })
    return arr;
}

//time: O(n)
const companiesByNumberOfOfferings = (companyList, offeringList, n) => {
    let obj = {};
    //O(n)
    offeringList.forEach(offer => {
        let compId = offer.companyId;
        if (obj.hasOwnProperty(compId)) {
            obj[compId] += 1;
        }
        else {
            obj[compId] = 1;
        }
    })
    //O(n)
    const filteredSums = Object.keys(obj).filter(key => obj[key] >= n);
    //O(n);
    return companyList.filter(company => filteredSums.includes(company.id));
}

//time: O(n^2)
const processProducts = (obj) => {
    let freqObj = {};
    //O(n)
    obj.offerings.forEach(offer => {
        let prodId = offer.productId;
        //O(n)
        if (freqObj.hasOwnProperty(prodId)) {
            freqObj[prodId].count += 1;
            freqObj[prodId].priceSum += offer.price;
        }
        else {
            freqObj[prodId] = {count: 0, priceSum: 0};
        }
    });
    //O(n)
    return obj.products.map(prod => {
        prod.averageOfferingPrice = freqObj[prod.id].priceSum / freqObj[prod.id].count;
        return prod;
    })
}

//------------

const fetchCompanies = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/companies')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

const fetchProducts = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/products')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

const fetchOfferings = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/offerings')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

Promise.all([fetchCompanies(), fetchProducts(), fetchOfferings()])
    .then(responses => {
        const [companies, products, offerings] = responses;
        const priceRange = findProductsInPriceRange(products, {min: 1, max: 15});
        console.log('findProductsInPriceRange min:3 max:5 ', priceRange);
        const groupedByLetter = groupCompaniesByLetter(companies);
        console.log('groupCompaniesByLetter ', groupedByLetter);
        const groupedByState = groupCompaniesByState(companies);
        console.log('groupCompaniesByState ', groupedByState);
        const processedOfferings = processOfferings({companies, products, offerings});
        console.log('processOfferings ', processedOfferings);
        const companyOfferings = companiesByNumberOfOfferings(companies, offerings, 3);
        console.log(' companiesByNumberOfOfferings ', companyOfferings);
        const processedProducts = processProducts({products, offerings});
        console.log('processedProducts ', processedProducts);
    })
    .catch(error => console.log(error))

