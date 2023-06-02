function getFetch() {
    let inputVal = document.getElementById('barcode').value

    if (inputVal.length !==12) {
        alert (`Please ensure that barcode is 12 characters`)
        return;
    }
    
    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`
    
    fetch(url)
    .then(res => res.json()) //parse JSON asa response
    .then(data => {
        console.log(data)
        if (data.status === 1) {  
            const item = new ProductInfo(data.product)  

item.showInfo()
item.listIngredients()
item.clearAll()

            // call additional stuff
          } else if (data.status === 0) {
            alert (`Product ${inputVal} not found`)
          }
    })

    .catch(err => {
        console.log(`error ${err}`)
    });
}

class ProductInfo {
    constructor(productData) { // passing in data.product
        this.brand = productData.brands
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }

    showInfo() {
        console.log(this.ingredients)
        document.getElementById('product-img').src = this.image
        document.getElementById('product-name').innerHTML = this.name
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredient-table')
        for (let i = 1; i < tableRef.rows.length;)
        {
            tableRef.deleteRow(i);
        }

        if (!(this.ingredients == null)) {
        for (let key in this.ingredients) {
            let newRow = tableRef.insertRow(-1)
            let newICell = newRow.insertCell(0)
            let newVCell = newRow.insertCell(1)
            let newIText = document.createTextNode(this.ingredients[key].text);
            
            let vegStatus = this.ingredients[key].vegetarian == null ? 'unknown' : this.ingredients[key].vegetarian
            let newVText = document.createTextNode(vegStatus);
            newICell.appendChild(newIText);
            newVCell.appendChild(newVText);
            if (vegStatus === 'no') {
                newVCell.classList.add('non-veg-item')
            } else if (vegStatus === 'unknown' || vegStatus === 'maybe')
            {
                newVCell.classList.add('unknown-item')
            }
        }
    }
}
}
