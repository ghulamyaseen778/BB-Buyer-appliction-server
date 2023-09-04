# BB-Buyer-appliction-server

## Product Upload Object

```JavaScript
{
    product:{
        title: "test product",
        description: "test product description",
        price: "9000",
        rating: "0.0",
        category: "pants"
    },
    productDetails: {
        styleCode: "UIOPH",
        colors: [
            "blue",
            "red"
        ],
        sizes: ["S","M"],
        pattern: "printed"
    }
}

```

## Push Data into Array

```JavaScript

{
  "$push":{"rating":{"rating":3,"id":"dddddd"}}
}

```
