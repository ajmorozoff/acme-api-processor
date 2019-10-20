
const findProductsInPriceRange = (productList, range) => {
    return productList.filter(prod => prod.suggestedPrice >= range.min && prod.suggestedPrice <= range.max);
}

const groupCompaniesByLetter = (companyList) => {
    let obj = {};
    companyList.forEach(company => {
        let letter = company.name.slice(0, 1).toUpperCase();
        if (obj.hasOwnProperty(letter)) {
            obj[letter].push(company);
        }
        else {
            obj[letter] = [];
            obj[letter].push(company);
        }
    })
    return obj;
}

const groupCompaniesByState = (companyList) => {
    let obj = {};
    companyList.forEach(company => {
        let state = company.state;
        if (obj.hasOwnProperty(state)) {
            obj[state].push(company);
        }
        else {
            obj[state] = [];
            obj[state].push(company);
        }
    })
    return obj;
}

const processOfferings = (obj) => {
    let arr = [];
    obj.offerings.forEach(offer => {
        offer.company = obj.companies.filter(company => company.id === offer.companyId)[0];
        offer.product = obj.products.filter(prod => prod.id === offer.productId)[0];
        arr.push(offer);
    })
    return arr;
}

const companiesByNumberOfOfferings = (companyList, offeringList, n) => {
    let freqObj = {};
    offeringList.forEach(offer => {
        let compId = offer.companyId;
        if (freqObj.hasOwnProperty(compId)) {
            freqObj[compId] += 1;
        }
        else {
            freqObj[compId] = 1;
        }
    })
    const filteredSums = Object.keys(freqObj).filter(key => freqObj[key] >= n);
    return companyList.filter(company => filteredSums.includes(company.id));
}

const processProducts = (obj) => {
    let freqObj = {};
    obj.offerings.forEach(offer => {
        let prodId = offer.productId;
        if (freqObj.hasOwnProperty(prodId)) {
            freqObj[prodId].count += 1;
            freqObj[prodId].priceSum += offer.price;
        }
        else {
            freqObj[prodId] = {count: 0, priceSum: 0};
        }
    });
    return obj.products.map(prod => {
        let avg = freqObj[prod.id].priceSum / freqObj[prod.id].count;
        prod.averageOfferingPrice = avg;
        return prod;
    })
}

//------------

const grabCompanies = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/companies')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

const grabProducts = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/products')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

const grabOfferings = () => new Promise((resolve, reject) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/offerings')
            .then(response => response.json())
            .then(jsonData => resolve(jsonData))
            .catch(e => reject(e));
});

//------------
let responses = [];

grabCompanies()
    .then(companyData => {
        responses.push(companyData)
        return grabProducts();
    })
    .then(productData => {
        responses.push(productData);
        return grabOfferings();
    })
    .then(offeringData => {
        responses.push(offeringData);
        return responses;
    })
    .then(completedData => {
        const [companies, products, offerings] = completedData;
        console.log('offerings ', offerings);
        console.log('products ', products);
        console.log('companies ', companies);
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

