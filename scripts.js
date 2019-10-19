let companies = undefined;
let products = undefined;
let offerings = undefined;

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

const companiesByNumberOfOfferings = (companies, offerings, n) => {

}

const processProducts = (obj) => {

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
grabCompanies()
    .then(companyData => {
        companies = companyData;
        return grabProducts();
    })
    .then(productData => {
        products = productData;
        return grabOfferings();
    })
    .then(offeringData => {
        offerings = offeringData;
        console.log('offerings ', offerings);
        console.log('products ', products);
        console.log('companies ', companies);
        const responses = [companies, products, offerings];
        return responses
    })
    .then(completedData => {
        const priceRange = findProductsInPriceRange(products, {min: 3, max: 5});
        console.log('findProductsInPriceRange min:3 max:5 ', priceRange);
        const groupedByLetter = groupCompaniesByLetter(companies);
        console.log('groupCompaniesByLetter ', groupedByLetter);
        const groupedByState = groupCompaniesByState(companies);
        console.log('groupCompaniesByState ', groupedByState);
        const processedOfferings = processOfferings({companies, products, offerings});
        console.log('processOfferings ', processedOfferings);
    })

